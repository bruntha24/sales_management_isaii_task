const Task = require("../models/Task");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const io = require("../server"); // your socket.io instance

// Assign a task
exports.assignTask = async (req, res) => {
  try {
    const { title, description, assignedTo, longitude, latitude, clientName, clientEmail, products } = req.body;
    const assignedBy = req.user.id;

    let media = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
        media.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy,
      media,
      clientName,
      clientEmail,
      products,
      location: { type: "Point", coordinates: [longitude, latitude] },
    });

    // Emit real-time notification
    io.to(assignedTo).emit("newTask", task);

    res.status(201).json({ success: true, task, message: "Task assigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get tasks for logged-in user
exports.getUserTasks = async (req, res) => {
  try {
    // Remove strict filter to see all tasks (for debugging) or keep assignedTo
    const tasks = await Task.find({ assignedTo: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
    io.to(task.assignedBy.toString()).emit("taskUpdated", task);

    res.json({ success: true, task, message: "Task status updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
