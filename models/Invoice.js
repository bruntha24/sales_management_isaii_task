// models/Invoice.js
const mongoose = require("mongoose");

// Each item in an invoice
const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

// Invoice schema
const invoiceSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false, // optional for email billing
    },
    items: {
      type: [itemSchema],
      required: true,
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    media: {
      images: { type: [String], default: [] },
      videos: { type: [String], default: [] },
      voiceNotes: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

// Automatically calculate totalAmount before saving
invoiceSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
