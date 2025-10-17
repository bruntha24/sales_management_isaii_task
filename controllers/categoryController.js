const Category = require("../models/Category");
const Product = require("../models/Product");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name)
      return res.status(400).json({ success: false, message: "Name is required" });

    const existing = await Category.findOne({ name });
    if (existing)
      return res.status(400).json({ success: false, message: "Category already exists" });

    const category = await Category.create({ name, description });
    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all Categories with Products
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    // Attach products for each category
    const categoriesWithProducts = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({ category: cat._id });
        return {
          _id: cat._id,
          name: cat.name,
          description: cat.description,
          products: products.map((p) => ({
            _id: p._id,
            name: p.name,
            price: p.price,
            description: p.description,
            images: p.images,
            videos: p.videos,
          })),
        };
      })
    );

    res.json({ success: true, categories: categoriesWithProducts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
