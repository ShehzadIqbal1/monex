const mongoose = require("mongoose");

const userGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  contributionType: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: true,
  },
  deadLine: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    },
});

module.exports = mongoose.model("UserGoal", userGoalSchema);
