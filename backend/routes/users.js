const express = require('express');
const mongoose = require('mongoose');
const uploads = require('../middleware/uploads');

const router = express.Router();

const User = mongoose.model('User');

router.get('/', async function (req, res, next) {
  const users = await User.find();

  res.status(200).json({ message: "Successfully retreived users", users });
});
router.post('/', uploads.single('avatar_url'), async function (req, res, next) {
  try {
    const body = req.body;
    if (!body || !body.username) {
      return res.status(400).json({ error: "Bad Request. The field 'username' is required." });
    }

    const imagePath = req.file ? `/images/${req.file.filename}` : '';

    const user = {
      username: body.username,
      avatarURL: imagePath,
      createdAt: new Date()
    }

    const newUser = await User.create(user);

    res.status(201).json({ message: "Successfully made user", user: newUser });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/upload-avatar', uploads.single('avatar_url'), async function (req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const imagePath = req.file ? `/images/${req.file.filename}` : '';

    // TODO find user and update avatarURL
    const user = await User.findOne({ id: req.params.id });
    console.log(req.file, imagePath, user);

    res.status(201).json({ message: "Successfully uploaded avatar", user: newUser });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
