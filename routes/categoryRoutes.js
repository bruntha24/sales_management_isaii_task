const express = require("express");
const router = express.Router();
const { createCategory, getCategories } = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createCategory);
router.get("/", protect, getCategories);

module.exports = router;
