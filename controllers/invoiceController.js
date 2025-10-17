const Invoice = require("../models/Invoice");

// Create new invoice
exports.createInvoice = async (req, res) => {
  try {
    const { clientName, products, totalAmount, location } = req.body;

    const invoice = await Invoice.create({
      clientName,
      products,
      totalAmount,
      createdBy: req.user._id,
      location,
    });

    res.status(201).json({ success: true, invoice });
  } catch (err) {
    console.error("Create Invoice Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get invoices for logged-in user
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ createdBy: req.user._id }).populate(
      "products.productId",
      "name price"
    );

    res.status(200).json({ success: true, invoices });
  } catch (err) {
    console.error("Get Invoices Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      "products.productId",
      "name price"
    );

    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    // Ensure user owns the invoice
    if (invoice.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.status(200).json({ success: true, invoice });
  } catch (err) {
    console.error("Get Invoice By ID Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
