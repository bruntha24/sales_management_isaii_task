// routes/invoiceRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Invoice = require("../models/Invoice");

// Create invoice
router.post("/", protect, async (req, res) => {
  try {
    const { customerName, items } = req.body;
    const newInvoice = await Invoice.create({
      customer: req.user._id,
      customerName,
      items,
    });
    res.status(201).json({ success: true, invoice: newInvoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
