const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const uploads = require('../services/image-uploads');
const { userExistsInDb } = require('../utils');
const UserStatus = require('../models/enums/user-status');

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
// Not used a.t.m. but can be used for admin panel
router.post('/', uploads.single('avatar_url'), async function (req, res, next) {
  try {
    const body = req.body;
    if (!body || !body.username || !body.email) {
      return res.status(400).json({ error: "Bad Request. The fields 'username' and 'email' are required.", success: false });
    }

    const user = {
      username: body.username,
      email: body.email
    }

    const userExists = await userExistsInDb(user);
    if (userExists) {
      return res.status(409).json({ error: "Username or email already exists", success: false });
    }

    const imagePath = req.file ? `/images/${req.file.filename}` : '';
    user.avatar_url = imagePath;

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

    const oldUser = await User.findOne({ uid: req.params.id });
    if (oldUser && oldUser.avatar_url) {
      const filePath = path.join(__dirname, '..', 'public', oldUser.avatar_url);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file ${filePath}:`, err);
        }
      });
    }

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

router.patch('/:id', async function (req, res, next) {
  try {
    const body = req.body;
    if (!body || (!body.username && !body.email)) {
      return res.status(400).json({ error: "Bad Request. At least one of 'username' or 'email' is required.", success: false });
    }

    const user = {};
    if (body.username) user.username = body.username;
    if (body.email) user.email = body.email;

    const userExists = await userExistsInDb(user, req.params.id);
    if (userExists) {
      return res.status(409).json({ error: "Username or email already exists", success: false });
    }

    const updatedUser = await User.findOneAndUpdate({ uid: req.params.id }, user, { returnDocument: 'after' });

    res.status(201).json({ message: "Successfully updated user", user: updatedUser, success: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const newName = `deleted_user_${Math.floor(Math.random() * 1000000)}`;
    
    const oldUser = await User.findOne({ uid: req.params.id });
    if(!oldUser) return res.status(404).json({ error: "User not found", success: false });

    oldUser.old_username = oldUser.username;
    oldUser.username = newName;
    oldUser.disabled = true;
    await oldUser.save();

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.post('/:id/status', async function (req, res, next) {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    
    if (!status || !UserStatus.containsStatus(status)) {
      return res.status(400).json({ error: `Bad Request. The field 'status' is required and must be one of ${UserStatus.ALL.join(", ")}.`, success: false });
    }

    const user = await User.findOneAndUpdate({ uid: userId }, { status: status }, { returnDocument: 'after' });
    if (!user) return res.status(404).json({ error: "User not found", success: false });

    res.status(200).json({ message: "User status updated", success: true });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/friends', async function (req, res, next) {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ uid: userId }).populate('friends_details');
    if (!user) return res.status(404).json({ error: "User not found", success: false });

    res.status(200).json({ message: "Successfully retrieved friends", friends: user.friends_details, success: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/friends/:friend_id', async function (req, res, next) {
  try {
    const { id, friend_id } = req.params;

    const user = await User.findOneAndUpdate(
      { uid: id },
      { $pull: { friends: friend_id } },
      { returnDocument: 'after' }
    );

    const friend = await User.findOneAndUpdate(
      { uid: friend_id },
      { $pull: { friends: id } },
      { returnDocument: 'after' }
    );

    if (!user || !friend) return res.status(404).json({ error: "User not found", success: false });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
