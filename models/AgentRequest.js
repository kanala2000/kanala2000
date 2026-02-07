const mongoose = require("mongoose");

const AgentRequestSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  status: {
    type: String,
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AgentRequest", AgentRequestSchema);
