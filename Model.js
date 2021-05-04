const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema(
  {
    name: { type: String },
    country: { type: String },
    acutionPrice: { type: Number },
    iplTeam: { type: String },
  },
  {
    timestamps: true,
  }
);
const players = mongoose.model("players", PlayerSchema);
module.exports = players;
