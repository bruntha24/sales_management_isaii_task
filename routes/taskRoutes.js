const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { assignTask, getUserTasks, updateTaskStatus } = require("../controllers/taskController");

const router = express.Router();

// Assign a task with optional media files
router.post("/", protect, upload.array("files", 5), assignTask);

// Get tasks for logged-in user
router.get("/", protect, getUserTasks);

// Update task status
router.patch("/:taskId", protect, updateTaskStatus);

module.exports = router;
