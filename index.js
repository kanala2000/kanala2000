const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const AgentRequest = require("./models/AgentRequest");

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.post("/api/agent-request", async (req, res) => {
  try {
    const { name, mobile, email } = req.body;

    if (!name || !mobile || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const agent = await AgentRequest.create({
      name,
      mobile,
      email
    });

    res.status(201).json({
      success: true,
      message: "Agent request saved successfully",
      data: agent
    });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
