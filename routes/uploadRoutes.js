const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { uploadMedia } = require("../controllers/uploadController");

const router = express.Router();

router.post("/", upload.single("file"), uploadMedia);

module.exports = router;
