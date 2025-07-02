const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.js");
const { signUp, login } = require("../controllers/authController.js");


router.post("/signUp", upload.fields([{ name: "profileImage", maxCount: 1 }]), signUp);
 
//  const data = await signUp(req, res);
    // res.status(200).json({message: "Done", data});


router.post("/logIn", login);

module.exports = router;
