const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const uploads = require('../middleware/uploads');

const Room = mongoose.model("Room");
const User = mongoose.model("User");

router.get('/', async function(req, res, next) {
  try {
    const rooms = await Room.find();

    if (!rooms) return res.status(404).json({ message: "Not Found", error: "No rooms found", success: false });
    
    res.status(200).json({ message: "Rooms retrieved successfully", rooms, success: true });
  } catch (error) {
    next(err);
  }
});

router.post('/', uploads.single('room_image'), async function(req, res, next) {
  const { name, description, color_hex, room_owner } = req.body;

  if(!name || !description || !color_hex || !room_owner) return res.status(400).json({ message: "Bad Request", error: "The fields 'name', 'description', 'color_hex' and 'room_owner' are required", success: false });

  if(name.length > 50) return res.status(400).json({ message: "Bad Request", error: "The 'name' field must be maximum 50 characters long", success: false });
  if(description.length > 500) return res.status(400).json({ message: "Bad Request", error: "The 'description' field must be maximum 500 characters long", success: false });

  try {
    let imagePath = '';
    if(req.file) {
      imagePath = req.file ? `/images/${req.file.filename}` : '';
    }

    const room = await Room.create({ name, description, color_hex, image: imagePath, members: [room_owner], owner: room_owner });

    res.status(201).json({ message: "Room created successfully", room, success: true });
  } catch (error) {
    next(err);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    const room = await Room.findOne({ uid: req.params.id });

    if (!room) return res.status(404).json({ message: "Not Found", error: "Room not found", success: false });
    
    const members = await User.find({ uid: { $in: room.members } });

    res.status(200).json({ message: "Room retrieved successfully", room, members, success: true });
  } catch (error) {
    next(err);
  }
});

module.exports = router;
