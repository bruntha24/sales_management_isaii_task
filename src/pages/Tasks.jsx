import { useEffect, useState } from "react";
import axios from "axios";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setTasks(res.data.tasks || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Tasks</h2>
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-sm mt-1">
                Status: <span className="font-medium">{task.status}</span>
              </p>
            </div>
          ))
        ) : (
          <p>No tasks assigned yet.</p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
