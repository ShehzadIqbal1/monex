const express = require("express");
const router = express.Router();
const {
  addGoal,
  getAllGoals,
  getGoalsByAmountRange,
} = require("../controllers/userGoalController");

router.post("/add", addGoal);
router.get("/:userId", getAllGoals);
router.get("/filter/:userId", getGoalsByAmountRange);

module.exports = router;
