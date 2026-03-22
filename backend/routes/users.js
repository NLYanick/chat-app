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
      avatar_url: imagePath,
      created_at: new Date()
    }

    const newUser = await User.create(user);

    res.status(201).json({ message: "Successfully made user", user: newUser });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async function (req, res, next) {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ message: "Successfully retrieved user", user });
});

router.post('/:id/upload-avatar', uploads.single('avatar_url'), async function (req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const imagePath = req.file ? 
      `${process.env.BASE_URL}/api/${process.env.API_VERSION}/public/images/${req.file.filename}` : 
      '';

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar_url: imagePath },
      { returnDocument: 'after' }
    );

    res.status(201).json({ message: "Successfully uploaded avatar", user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
