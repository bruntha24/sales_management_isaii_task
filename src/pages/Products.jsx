// src/pages/Products.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.length === 0 && <p>No products available.</p>}
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white p-4 rounded shadow hover:shadow-lg transition"
        >
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-gray-600 mt-1">Price: ${product.price}</p>
          <p className="text-gray-500 mt-1">{product.description}</p>

          {/* Images */}
          {product.images?.length > 0 &&
            product.images.map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt={product.name}
                className="mt-2 w-full h-48 object-cover rounded"
              />
            ))}

          {/* Videos */}
          {product.videos?.length > 0 &&
            product.videos.map((videoUrl, idx) => (
              <video
                key={idx}
                src={videoUrl}
                controls
                className="mt-2 w-full h-48 rounded"
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default Products;
