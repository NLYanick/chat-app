const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const uploads = require('../middleware/uploads');

const Room = mongoose.model("Room");

router.get('/', async function(req, res, next) {
  const rooms = await Room.find();

  if (!rooms) return res.status(404).json({ message: "Not Found", error: "No rooms found", success: false });
  
  res.status(200).json({ message: "Rooms retrieved successfully", rooms, success: true });
});

router.post('/', uploads.single('room_image'), async function(req, res, next) {
  const { name, description, color_hex } = req.body;

  if(!name || !description || !color_hex) return res.status(400).json({ message: "Bad Request", error: "The fields 'name', 'description' and 'color_hex' are required", success: false });

  if(name.length > 50) return res.status(400).json({ message: "Bad Request", error: "The 'name' field must be maximum 50 characters long", success: false });
  if(description.length > 500) return res.status(400).json({ message: "Bad Request", error: "The 'description' field must be maximum 500 characters long", success: false });

  try {
    let imagePath = '';
    if(req.file) {
      imagePath = req.file ? `/images/${req.file.filename}` : '';
    }
    
    const room = await Room.create({ name, description, color_hex, image: imagePath });

    res.status(201).json({ message: "Room created successfully", room, success: true });
  } catch (error) {
    res.status(400).json({ message: "Bad Request", error: error.message, success: false });
  }
});

module.exports = router;
