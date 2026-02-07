const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const AgentRequest = require("./agentrequest");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.post("/api/agent-request", async (req, res) => {
  try {
    const { name, mobile, email } = req.body;

    if (!name || !mobile || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const newRequest = new AgentRequest({ name, mobile, email });
    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Agent request received",
      data: newRequest
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
