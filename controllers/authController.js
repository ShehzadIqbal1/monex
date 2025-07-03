const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");
const { sendOTPEmail } = require("../utils/sendEmail");
const { generateOTP } = require("../utils/generateOtp");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    await User.findOneAndDelete({ email, isVerified: false });

    let profileImage = "";

    if (req.files?.profileImage?.[0]) {
      const fileBuffer = req.files.profileImage[0].buffer;
      // Wrap in a Promise to use async/await
      profileImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );

        stream.end(fileBuffer);
      });
    }

    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      profileImage,
      otp,
      isVerified: false,
    });
    await newUser.save();
    await sendOTPEmail(email, otp);
    return res
      .status(200)
      .json({ message: "An OTP has been sent to your email" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          id: user._id,
          email: user.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15d" }
    );
    res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { signUp, login };
