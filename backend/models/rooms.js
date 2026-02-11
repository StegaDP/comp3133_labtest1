const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createon: {
    type: Date,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);
