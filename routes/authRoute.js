const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.js");
const { signUp, login } = require("../controllers/authController.js");

// router.post("/signUp", upload.fields([{name: "profileImage", maxCount: 1}]), signUp);
router.post("/signUp", upload.fields([{name: "profileImage", maxCount: 1}]), (req,res) => {
    console.log(req.body);
    console.log(req.files);
    return res.status(204)
});
router.post("/login", login);

module.exports = router;
