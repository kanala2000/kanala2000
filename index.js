const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const AgentRequest = require("./models/AgentRequest");

const app = express();
app.use(express.json());

/* ================= MONGODB CONNECT ================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

/* ================= ROOT CHECK ================= */
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

/* ================= AGENT REQUEST API ================= */
app.post("/api/agent-request", async (req, res) => {
  try {
    const { name, mobile, email } = req.body;

    // Validation
    if (!name || !mobile || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Save to DB
    const agent = new AgentRequest({
      name,
      mobile,
      email,
      status: "Pending"
    });

    await agent.save();

    return res.status(201).json({
      success: true,
      message: "Agent request saved successfully",
      data: agent
    });

  } catch (error) {
    console.error("Agent request error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

/* ================= SERVER START ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
