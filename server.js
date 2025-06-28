const express = require("express");
require("dotenv").config();
const connectDB = require("./utils/db");
const authRoutes = require("./routes/authRoute");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
