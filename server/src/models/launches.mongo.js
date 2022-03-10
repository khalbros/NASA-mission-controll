const mongoose = require("mongoose")

// flightNumber: 100,
//   mission: "Kepler Expoloratiom",
//   rocket: "Explorer IS1",
//   launchDate: new Date("December 27, 2030"),
//   target: "kepler-442 b",
//   customers: ["ZTM", "NASA"],
//   upcoming: true,
//   success: true,

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  customers: [String],
  launchDate: {
    type: Date,
    required: true,
  },
  upcoming: {
    type: Boolean,
    required: true,
    default: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
})

module.exports = mongoose.model("launch", launchesSchema)
