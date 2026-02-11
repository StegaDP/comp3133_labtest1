const express = require("express");
const roomModel = require("../models/rooms");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  try {
    const roomsList = await roomModel.find();
    const rooms = roomsList.map((room) => ({
      name: room.roomname,
    }));
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/join", async (req, res) => {
  const { roomname } = req.body;
  const userToken = req.headers.token;

  const { id, username } = jwt.verify(userToken, process.env.JWT_SECRET);

  const room = await roomModel.findOne({ roomname });
  if (!room) return res.status(404).json({ message: "Room not found" });

  if (room.users.includes(id))
    return res.status(400).json({ message: "User already in room" });

  room.users.push(id);
  await room.save();

  res.status(200).json({ message: "User joined room successfully" });
});

router.post("/leave", async (req, res) => {
  const { roomname } = req.body;
  const userToken = req.headers.token;

  const { id, username } = jwt.verify(userToken, process.env.JWT_SECRET);

  const room = await roomModel.findOne({ roomname });
  if (!room) return res.status(404).json({ message: "Room not found" });

  if (!room.users.includes(id))
    return res.status(400).json({ message: "User not in room" });

  room.users = room.users.filter((userId) => {
    return userId._id.toString() !== id;
  });
  await room.save();

  res.status(200).json({ message: "User left room successfully" });
});

module.exports = router;
