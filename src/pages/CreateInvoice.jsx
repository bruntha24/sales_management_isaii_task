import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const palette = {
  background: "#D9CFC0",      // Warm beige
  sectionBg: "#A5A091",       // Muted sage gray-green
  accent: "#E6B8A2",          // Soft blush pink
  text: "#4E4B44",            // Deep taupe gray
  highlight: "#F9F5F0",       // Creamy off-white
  button: "#BFA78A",           // Warm sand brown
  buttonHover: "#A78C64",     // Slightly darker for hover
};

const CreateInvoice = () => {
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [clientName, setClientName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products");
      }
    };
    fetchProducts();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`),
        (err) => {
          console.error(err);
          toast.error("Location access denied");
        }
      );
    }
  }, [token]);

  const handleAddProduct = (product) => {
    if (!selectedProducts.find((p) => p._id === product._id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== productId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || selectedProducts.length === 0) {
      toast.error("Please enter client name and select products");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/billing",
        {
          clientName,
          products: selectedProducts.map((p) => ({ id: p._id, name: p.name, price: p.price })),
          location,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        toast.success("Invoice created successfully!");
        setClientName("");
        setSelectedProducts([]);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: palette.background,
        minHeight: "100vh",
        fontFamily: "sans-serif",
        color: palette.text,
      }}
    >
      <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "24px" }}>Create Invoice</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }}>
        <div>
          <label style={{ marginBottom: "4px", display: "block", fontWeight: "600" }}>Client Name</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter client name"
            required
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              border: `1px solid ${palette.sectionBg}`,
              outline: "none",
            }}
          />
        </div>

        <div>
          <label style={{ marginBottom: "4px", display: "block", fontWeight: "600" }}>Products</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {products.map((product) => {
              const isSelected = selectedProducts.find((p) => p._id === product._id);
              return (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => handleAddProduct(product)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: `1px solid ${palette.sectionBg}`,
                    backgroundColor: isSelected ? palette.accent : palette.highlight,
                    color: palette.text,
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = palette.buttonHover)}
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = isSelected ? palette.accent : palette.highlight)
                  }
                >
                  {product.name} (${product.price})
                </button>
              );
            })}
          </div>
        </div>

        {selectedProducts.length > 0 && (
          <div>
            <h4 style={{ fontWeight: "600", marginTop: "8px" }}>Selected Products:</h4>
            <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
              {selectedProducts.map((p) => (
                <li key={p._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  {p.name} - ${p.price}
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(p._id)}
                    style={{ color: "red", marginLeft: "8px", cursor: "pointer" }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label style={{ marginBottom: "4px", display: "block", fontWeight: "600" }}>Location</label>
          <input
            type="text"
            value={location}
            readOnly
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              border: `1px solid ${palette.sectionBg}`,
              backgroundColor: palette.highlight,
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 16px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: palette.button,
            color: palette.highlight,
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = palette.buttonHover)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = palette.button)}
        >
          {loading ? "Creating..." : "Create Invoice"}
        </button>
      </form>
    </div>
  );
};

export default CreateInvoice;
