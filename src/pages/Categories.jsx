import { useEffect, useState } from "react";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Assuming backend returns categories with products
        // e.g., { _id, name, description, products: [{_id, name, price}] }
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Categories & Products</h2>

      {categories.length === 0 ? (
        <p>No categories available.</p>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-lg">{cat.name}</h3>
              <p className="text-gray-600 mt-1 mb-2">{cat.description}</p>

              {cat.products && cat.products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  {cat.products.map((prod) => (
                    <div key={prod._id} className="bg-gray-50 p-3 rounded border">
                      <h4 className="font-medium">{prod.name}</h4>
                      <p className="text-gray-500 text-sm">Price: ${prod.price}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-1">No products in this category.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
