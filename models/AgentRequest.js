const mongoose = require("mongoose");

const AgentRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Pending",
    },
    agentId: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AgentRequest", AgentRequestSchema);
