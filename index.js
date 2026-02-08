const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const AgentRequest = require("./models/AgentRequest");

const app = express();
app.use(express.json());

/* ================= DB CONNECT ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

/* ================= CREATE AGENT REQUEST (POST) ================= */
app.post("/api/agent-request", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const { name, mobile, email } = req.body;

    if (!name || !mobile || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const agent = await AgentRequest.create({
      name,
      mobile,
      email,
    });

    res.status(201).json({
      success: true,
      message: "Agent request saved successfully",
      data: agent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ================= ADMIN: GET ALL AGENT REQUESTS ================= */
app.get("/api/admin/agent-request", async (req, res) => {
  try {
    const requests = await AgentRequest.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ================= ADMIN APPROVE / REJECT ================= */
app.put("/api/admin/agent-request/:id", async (req, res) => {
  try {
    const { status } = req.body; // Approved or Rejected
    const { id } = req.params;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const updated = await AgentRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Agent request not found"
      });
    }

    res.json({
      success: true,
      message: `Agent request ${status}`,
      data: updated
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
/* ================= ADMIN APPROVE AGENT ================= */
app.put("/api/admin/agent-request/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await AgentRequest.findById(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found"
      });
    }

    // already approved check
    if (agent.status === "Approved") {
      return res.json({
        success: true,
        message: "Agent already approved",
        data: agent
      });
    }

    // generate Agent ID & Password
    const agentId = "AG" + Math.floor(100000 + Math.random() * 900000);
    const password = "Ag@" + Math.floor(1000 + Math.random() * 9000);

    agent.status = "Approved";
    agent.agentId = agentId;
    agent.password = password;

    await agent.save();

    res.json({
      success: true,
      message: "Agent approved successfully",
      data: agent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
/* ================= END ADMIN APPROVE ================= */

/* ================= SERVER ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
