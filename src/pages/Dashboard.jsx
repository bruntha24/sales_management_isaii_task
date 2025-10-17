import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { FaTasks, FaBoxOpen, FaThList } from "react-icons/fa";

const COLORS = ["#3B82F6", "#D4AF37", "#1E40AF"]; // blue, gold, dark blue

const Dashboard = () => {
  const [stats, setStats] = useState({ tasks: 0, products: 0, categories: 0 });
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchStats = async () => {
      try {
        const tasksRes = await axios.get("http://localhost:8080/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productsRes = await axios.get("http://localhost:8080/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const categoriesRes = await axios.get("http://localhost:8080/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats({
          tasks: tasksRes.data.tasks?.length || 0,
          products: productsRes.data.products?.length || 0,
          categories: categoriesRes.data.categories?.length || 0,
        });

        setTasks(tasksRes.data.tasks || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const pieData = [
    { name: "Tasks", value: stats.tasks },
    { name: "Products", value: stats.products },
    { name: "Categories", value: stats.categories },
  ];

  const barData = tasks.map((task) => ({
    name: task.title.length > 15 ? task.title.slice(0, 12) + "..." : task.title,
    status: task.status === "completed" ? 1 : 0,
  }));

  const icons = {
    tasks: <FaTasks size={30} className="text-blue-600" />,
    products: <FaBoxOpen size={30} className="text-yellow-500" />,
    categories: <FaThList size={30} className="text-indigo-700" />,
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold capitalize text-gray-800">{key}</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">{value}</p>
            </div>
            <div>{icons[key]}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Task Completion</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="status" fill="#D4AF37" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
