const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const uploads = require('../services/image-uploads');

const Room = mongoose.model("Room");
const User = mongoose.model("User");

router.get('/', async function(req, res, next) {
  try {
    const { user_id } = req.query;
    
    const rooms = user_id ? await Room.find({ members: { $in: [user_id] } }) : await Room.find();

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

router.patch('/:id', uploads.single('room_image'), async function(req, res, next) {
  const { name, description, color_hex, sender } = req.body;

  const room = await Room.findOne({ uid: req.params.id, owner: sender });
  if (!room || !sender === room.owner) return res.status(403).json({ message: "Forbidden", error: "You are not the owner of this room", success: false });
  if(!name || !description || !color_hex) return res.status(400).json({ message: "Bad Request", error: "The fields 'name', 'description', and 'color_hex' are required", success: false });

  if(name.length > 50) return res.status(400).json({ message: "Bad Request", error: "The 'name' field must be maximum 50 characters long", success: false });
  if(description.length > 500) return res.status(400).json({ message: "Bad Request", error: "The 'description' field must be maximum 500 characters long", success: false });

  try {
    const updateFields = { name, description, color_hex };

    if(req.file) 
      updateFields.image = req.file ? `/images/${req.file.filename}` : '';

    const room = await Room.findOneAndUpdate({ uid: req.params.id }, updateFields, { new: true });

    res.status(200).json({ message: "Room updated successfully", room, success: true });
  } catch (error) {
    next(err);
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    const ownedRoom = await Room.findOne({ uid: req.params.id, owner: req.body.sender });
    if (!ownedRoom || !req.body.sender === ownedRoom.owner) return res.status(403).json({ message: "Forbidden", error: "You are not the owner of this room", success: false });
    
    const room = await Room.findOne({ uid: req.params.id });
    if (!room) return res.status(404).json({ message: "Not Found", error: "Room not found", success: false });

    await Room.deleteOne({ uid: req.params.id });

    res.status(204).send();
  } catch (error) {
    next(err);
  }
});

router.delete('/:id/members/leave', async function(req, res, next) {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ message: "Bad Request", error: "The field 'user_id' is required", success: false });

  try {
    const room = await Room.findOne({ uid: req.params.id });
    if (!room) return res.status(404).json({ message: "Not Found", error: "Room not found", success: false });

    room.members.pull(user_id);
    await room.save();

    res.status(204).send();
  } catch (error) {
    next(err);
  }
});

router.delete('/:id/members/:user_id', async function(req, res, next) {
  const { user_id, id } = req.params;
  const { removed_by } = req.body;
  if (!removed_by) return res.status(400).json({ message: "Bad Request", error: "The field 'removed_by' is required (uid of the user removing the member)", success: false });

  try {
    const room = await Room.findOne({ uid: req.params.id });
    if (!room) return res.status(404).json({ message: "Not Found", error: "Room not found", success: false });

    if (removed_by !== room.owner) return res.status(403).json({ message: "Forbidden", error: "You are not the owner of this room", success: false });

    room.members.pull(user_id);
    await room.save();

    res.status(204).send();
  } catch (error) {
    next(err);
  }
});

module.exports = router;
