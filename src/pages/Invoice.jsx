import React, { useState, useEffect } from "react";
import axios from "axios";

const Invoice = () => {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [items, setItems] = useState([{ description: "", quantity: 1, price: 0 }]);
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [invoices, setInvoices] = useState([]);
  const token = localStorage.getItem("token"); // JWT token

  // ✅ Fetch user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Location access denied:", err);
        }
      );
    }
  }, []);

  // ✅ Fetch invoices on load
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/billing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(res.data.invoices || []);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  // ✅ Handle item changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "description" ? value : Number(value);
    setItems(newItems);
  };

  // ✅ Add / remove item rows
  const addItem = () => setItems([...items, { description: "", quantity: 1, price: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, idx) => idx !== index));

  // ✅ Calculate total
  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  // ✅ Submit invoice to backend
  const submitInvoice = async () => {
    if (!customerName || !email) {
      alert("Please enter both customer name and email!");
      return;
    }

    try {
      const invoiceData = {
        customerName,
        email,
        items,
        location,
      };

      const res = await axios.post("http://localhost:8080/api/billing", invoiceData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        alert("✅ Invoice created and emailed successfully!");
        setCustomerName("");
        setEmail("");
        setItems([{ description: "", quantity: 1, price: 0 }]);
        fetchInvoices();
      } else {
        alert("❌ Failed to create invoice");
      }
    } catch (err) {
      console.error("Error submitting invoice:", err);
      alert("❌ Server error while creating invoice");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center">🧾 Create Invoice</h1>

      {/* Customer details */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Customer Name:</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="border px-3 py-2 w-full rounded"
          placeholder="Enter client name"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Customer Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 w-full rounded"
          placeholder="Enter client email"
        />
      </div>

      {/* Items section */}
      <h2 className="text-xl font-semibold mb-2">Products / Services</h2>
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Description"
            value={item.description}
            onChange={(e) => handleItemChange(idx, "description", e.target.value)}
            className="border px-2 py-1 flex-1 rounded"
          />
          <input
            type="number"
            placeholder="Qty"
            value={item.quantity}
            onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
            className="border px-2 py-1 w-24 rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={item.price}
            onChange={(e) => handleItemChange(idx, "price", e.target.value)}
            className="border px-2 py-1 w-28 rounded"
          />
          {items.length > 1 && (
            <button
              onClick={() => removeItem(idx)}
              className="bg-red-500 text-white px-3 rounded"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addItem}
        className="bg-blue-500 text-white px-4 py-1 mt-2 rounded"
      >
        + Add Item
      </button>

      {/* Total & Submit */}
      <div className="mt-6">
        <strong>Total:</strong> ₹{totalAmount}
      </div>

      <div className="mt-4">
        <button
          onClick={submitInvoice}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          📩 Submit & Email Invoice
        </button>
      </div>

      {/* Invoices List */}
      <h2 className="text-xl font-semibold mt-10 mb-3">📜 Previous Invoices</h2>
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <ul>
          {invoices.map((inv) => (
            <li key={inv._id} className="border p-3 mb-2 rounded bg-gray-50">
              <div>
                <strong>Client:</strong> {inv.customerName || "N/A"}
              </div>
              <div>
                <strong>Email:</strong> {inv.email || "N/A"}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {new Date(inv.createdAt).toLocaleString() || "N/A"}
              </div>
              <div>
                <strong>Items:</strong>
                <ul className="ml-5 list-disc">
                  {inv.items?.map((it, i) => (
                    <li key={i}>
                      {it.description || "N/A"} — {it.quantity || 0} × ₹
                      {it.price || 0}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Location:</strong>{" "}
                {inv.location?.latitude || "N/A"}, {inv.location?.longitude || "N/A"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Invoice;

