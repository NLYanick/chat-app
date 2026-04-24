const express = require('express');
const mongoose = require('mongoose');
const uploads = require('../middleware/uploads');

const router = express.Router();

const User = mongoose.model('User');

router.get('/', async function (req, res, next) {
  try {
    const users = await User.find();

    res.status(200).json({ message: "Successfully retreived users", users, success: true });
  } catch (err) {
    next(err);
  }
});
router.post('/', uploads.single('avatar_url'), async function (req, res, next) {
  try {
    const body = req.body;
    if (!body || !body.username) {
      return res.status(400).json({ error: "Bad Request. The field 'username' is required.", success: false });
    }

    const imagePath = req.file ? `/images/${req.file.filename}` : '';

    const user = {
      username: body.username,
      avatar_url: imagePath
    }

    const newUser = await User.create(user);

    user.created_at = newUser.created_at;

    res.status(201).json({ message: "Successfully made user", user: newUser, success: true });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const user = await User.findOne({ uid: req.params.id });

    if (!user) return res.status(404).json({ error: "User not found", success: false });

    res.status(200).json({ message: "Successfully retrieved user", user, success: true });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/upload-avatar', uploads.single('avatar_url'), async function (req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded", success: false });

    const imagePath = req.file ? `/images/${req.file.filename}` : '';

    const user = await User.findOneAndUpdate(
      { uid: req.params.id },
      { avatar_url: imagePath },
      { returnDocument: 'after' }
    );

    res.status(201).json({ message: "Successfully uploaded avatar", user, success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
