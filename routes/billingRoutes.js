// routes/billingRoutes.js
const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // multer setup
const sendInvoiceEmail = require("../utils/sendInvoiceEmail"); // email utility

// ✅ Upload multiple media fields
const mediaUpload = upload.fields([
  { name: "images", maxCount: 5 },
  { name: "videos", maxCount: 3 },
  { name: "voiceNotes", maxCount: 3 },
]);

// ✅ POST /api/billing → Create invoice + media upload + email
router.post("/", protect, mediaUpload, async (req, res) => {
  try {
    const { customerName, email, items, location } = req.body;

    if (!items || !items.length)
      return res
        .status(400)
        .json({ success: false, message: "Invoice must have at least one item" });

    // ✅ Calculate total
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // ✅ Collect uploaded files
    const uploadedFiles = {};
    if (req.files) {
      if (req.files.images) uploadedFiles.images = req.files.images.map(f => f.path);
      if (req.files.videos) uploadedFiles.videos = req.files.videos.map(f => f.path);
      if (req.files.voiceNotes) uploadedFiles.voiceNotes = req.files.voiceNotes.map(f => f.path);
    }

    // ✅ Create invoice
    const newInvoice = await Invoice.create({
      customer: req.user._id,
      customerName,
      email,
      items,
      location,
      totalAmount,
      media: uploadedFiles, // store uploaded file paths
    });

    // ✅ Send email with invoice PDF and attachments
    if (email) {
      await sendInvoiceEmail(newInvoice);
      console.log("✅ Invoice email sent to:", email);
    }

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      invoice: newInvoice,
    });
  } catch (err) {
    console.error("❌ Invoice creation error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ GET /api/billing → Get all invoices of logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const invoices = await Invoice.find({ customer: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, invoices });
  } catch (err) {
    console.error("❌ Fetch invoices error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
