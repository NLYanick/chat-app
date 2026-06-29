const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Message = mongoose.model("Message");

router.get('/rooms/:room_id', async function(req, res, next) {
  try {
  const messages = await Message.find({ room: req.params.room_id }).sort({ created_at: 1 });
    if(!messages) return res.status(404).json({ message: "Not Found", error: "No messages found for this room", success: false });
    
    res.status(200).json({ messages, message: "Messages retrieved successfully", success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/rooms/:room_id', async function(req, res, next) {
  const { text, sender } = req.body;

  try {
    const newMessage = await Message.create({
      text,
      sender,
      room: req.params.room_id
    });
  
    res.status(201).json({ message: "Message created successfully", data: newMessage, success: true });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async function(req, res, next) {
  const { text } = req.body;

  try {
    const updatedMessage = await Message.findOneAndUpdate({ uid: req.params.id }, { text }, { new: true });

    if (!updatedMessage) {
      return res.status(404).json({ message: "Not Found", error: "Message not found", success: false });
    }

    res.status(200).json({ message: "Message updated successfully", data: updatedMessage, success: true });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    const deletedMessage = await Message.findOneAndDelete({ uid: req.params.id });

    if (!deletedMessage) {
      return res.status(404).json({ message: "Not Found", error: "Message not found", success: false });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
