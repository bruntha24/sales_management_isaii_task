const Product = require("../models/Product");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// Create Product (with Cloudinary upload)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ success: false, message: "Name, price, and category are required" });
    }

    let images = [];
    let videos = [];

    // Upload images to Cloudinary
    if (req.files?.images) {
      for (const img of req.files.images) {
        const result = await cloudinary.uploader.upload(img.path, { folder: "products/images" });
        images.push(result.secure_url);
        fs.unlinkSync(img.path); // remove local file
      }
    }

    // Upload videos to Cloudinary
    if (req.files?.videos) {
      for (const vid of req.files.videos) {
        const result = await cloudinary.uploader.upload(vid.path, {
          resource_type: "video",
          folder: "products/videos",
        });
        videos.push(result.secure_url);
        fs.unlinkSync(vid.path); // remove local file
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      category: categoryId,
      images,
      videos,
    });

    // Add product to category
    const category = await Category.findById(categoryId);
    if (category) {
      category.products.push(product._id);
      await category.save();
    }

    res.status(201).json({ success: true, product, message: "Product created successfully!" });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name description");
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
