const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.post("/api/agent-request", (req, res) => {
  const { name, mobile, email } = req.body;

  if (!name || !mobile || !email) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  res.status(201).json({
    success: true,
    message: "Agent request received",
    data: { name, mobile, email }
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
