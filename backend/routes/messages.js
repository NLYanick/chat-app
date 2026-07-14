const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const { fileUpload, MAX_FILES_AMOUNT, UPLOAD_DIR } = require('../services/file-uploads');
const { resolveFileType } = require('../utils');

const Message = mongoose.model("Message");
const File = mongoose.model("File");

router.get('/rooms/:room_id', async function(req, res, next) {
  try {
    const messages = await Message.find({ room: req.params.room_id }).populate('attachments_details').sort({ created_at: 1 });
    if(!messages) return res.status(404).json({ message: "Not Found", error: "No messages found for this room", success: false });

    res.status(200).json({ messages, message: "Messages retrieved successfully", success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/rooms/:room_id', fileUpload.array('files', MAX_FILES_AMOUNT), async function(req, res, next) {
  const { text, sender } = req.body;

  if (!sender || (!text && !req.files)) return res.status(400).json({ message: "Bad Request", error: "The field 'sender' is required and at least one of 'text' or 'files' is required.", success: false });
  
  try {
    let files = [];

    if (req.files && req.files.length > 0) {
      const filePromises = req.files.map(async (file) => {
        return await File.create({
          url: `/files/${file.filename}`,
          filename: file.originalname,
          storedName: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          type: resolveFileType(file.mimetype),
        });
      });

      files = await Promise.all(filePromises);
    }

    const newMessage = await Message.create({
      text,
      sender,
      room: req.params.room_id,
      attachments: files.map(file => file.uid),
    });
    newMessage.attachments_details = files;
  
    res.status(201).json({ message: "Message created successfully", data: newMessage, success: true });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async function(req, res, next) {
  const { text } = req.body;

  try {
    const updatedMessage = await Message.findOneAndUpdate(
      { uid: req.params.id }, 
      { text, attachments: req.body.attachments }, 
      { returnDocument: 'after' }
    ).populate('attachments_details');

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

    if (deletedMessage.attachments && deletedMessage.attachments.length > 0) {
      const filesToDelete = await File.find({ uid: { $in: deletedMessage.attachments } });
      await File.deleteMany({ uid: { $in: deletedMessage.attachments } });

      filesToDelete.forEach(file => {
        const filePath = UPLOAD_DIR + '/' + file.storedName;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete file ${filePath}:`, err);
          }
        });
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
