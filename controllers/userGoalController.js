const express = require("express");

const UserGoal = require("../models/userGoal");
const User = require("../models/User");

const addGoal = async (req, res) => {
  try {
    const { userId, title, amount, contributionType, deadLine } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!userId || !title || !amount || !contributionType || !deadLine) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newGoal = new UserGoal({
      userId,
      title,
      amount,
      contributionType,
      deadLine,
    });

    await newGoal.save();
    res.status(201).json({ message: "Goal added successfully", goal: newGoal });
  } catch (error) {
    console.error("Error adding goal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllGoals = async (req, res) => {
  try {
    const userId = req.params.userId;
    const goals = await UserGoal.find({ userId });
    if (!goals || goals.length === 0) {
      return res.status(404).json({ message: "No goals found for this user" });
    }
    res.status(200).json({ goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getGoalsByAmountRange = async (req, res) => {
  try {
    const { userId } = req.params;
    const min = parseFloat(req.query.min);
    const max = parseFloat(req.query.max);

    if (isNaN(min) || isNaN(max)) {
      return res.status(400).json({ message: "Invalid min or max amount" });
    }

    const goals = await UserGoal.find({
      userId,
      amount: { $gte: min, $lte: max },
    });
    console.log("Goals found:", goals);

    if (goals.length === 0) {
      return res.status(404).json({ message: "No goals found in this range" });
    }

    res.status(200).json({ goals });
  } catch (error) {
    console.error("Error fetching goals by range:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addGoal,
  getAllGoals,
  getGoalsByAmountRange,
};
