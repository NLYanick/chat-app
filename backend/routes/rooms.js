const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Room = mongoose.model("Room");

router.get('/', async function(req, res, next) {
  const rooms = await Room.find();

  if (!rooms) return res.status(404).json({ message: "No rooms found", success: false });
  
  res.status(200).json({ message: "Rooms retrieved successfully", rooms, success: true });
});

module.exports = router;
