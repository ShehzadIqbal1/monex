const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  phone: String,
  profileImage: String,
  otp: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: 900, partialFilterExpression: { isVerified: false } },
  },
});

module.exports = mongoose.model("User", userSchema);
