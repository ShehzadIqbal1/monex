const multer = require("multer");
const storage = multer.memoryStorage(); // no file saved locally
const upload = multer({ storage });
module.exports = upload;
