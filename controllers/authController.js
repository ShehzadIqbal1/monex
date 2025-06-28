const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");
const { sendOTPEmail } = require("../utils/sendEmail");

const bcrypt = require("bcrypt");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const signUp = async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    await User.findOneAndDelete({ email, isVerified: false });
    let profileImage = "";


    if (req.files?.profileImage) {
      console.log(req.files.profileImage)
      const uploaded = await cloudinary.uploader.upload(req.file?.profileImage);
      console.log(uploaded)
      profileImage = uploaded.secure_url;
    }

    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10); 

    const newUser = new User({
      email,
      password: hashedPassword,
      phone,
      profileImage,
      otp,
      isVerified: false,
    });
    await newUser.save();
    await sendOTPEmail(email, otp);
    return res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.isVerified) {
      return res.status(400).json({ message: "Invalid or already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    return res.status(200).json({ message: "User verified successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { signUp, login };
