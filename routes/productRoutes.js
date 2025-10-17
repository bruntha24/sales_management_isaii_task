const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect } = require("../middleware/authMiddleware");
const { createProduct, getProducts } = require("../controllers/productController");

// Multer setup
const uploadDir = path.join(__dirname, "../uploads/products");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post("/", protect, upload.fields([{ name: "images", maxCount: 5 }, { name: "videos", maxCount: 3 }]), createProduct);
router.get("/", protect, getProducts);

module.exports = router;
