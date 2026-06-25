const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const UserStatus = require('../models/enums/user-status');

const router = express.Router();

const User = mongoose.model('User');

router.post('/register', async function (req, res, next) {
  try {
    const { email, username, password, confirmPassword, staySignedIn } = req.body;

    // Extra backend validation
    if (!username || !password || !confirmPassword || !email) return res.status(400).json({ message: "Registration failed", error: "The fields \"username\", \"email\", and \"password\" are invalid.", success: false });
    if (password < 5) return res.status(400).json({ message: "Registration failed", error: "Password must be at least 5 characters long.", success: false });
    if (confirmPassword !== password) return res.status(400).json({ message: "Registration failed", error: "\"Confirm Password\" must be equal to \"Password\".", success: false });

    const existingUser = await User.findOne({ username });

    if (existingUser) return res.status(400).json({ message: "Registration failed", error: "Username already exists.", success: false });

    const passwordResetToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      username,
      email,
      avatar_url: '',
      password: password,
      password_reset_token: passwordResetToken,
      status: UserStatus.ONLINE
    });

    const userData = { 
      uid: user.uid,
      username: user.username,
      email: user.email, 
      avatar_url: user.avatar_url, 
      created_at: user.created_at
    }

    res.status(201).json({ message: "Registered!", success: true, user: userData });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async function (req, res, next) {
  try {
    const { username, password, staySignedIn } = req.body;

    // Extra backend validation
    if (!username || !password) return res.status(400).json({ message: "Login failed", error: "The fields \"username\" and \"password\" are invalid.", success: false });
    
    const user = await User.findOne({ username }).select('+password');
    if (!user) return res.status(404).json({ message: "Login failed", error: "Username doesn't exist.", success: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Login failed", error: "Invalid username or password", success: false });

    user.status = UserStatus.ONLINE;
    await user.save();

    const userData = { 
      uid: user.uid,
      username: user.username,
      email: user.email, 
      avatar_url: user.avatar_url, 
      created_at: user.created_at
    }
    
    res.status(200).json({ message: "Logged In!", success: true, user: userData });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async function (req, res, next) {
  try {
    const { username } = req.body;

    // Extra backend validation
    if (!username) return res.status(400).json({ message: "Login failed", error: "The fields \"username\" and \"password\" are invalid.", success: false });
    
    // TODO
    await User.findOneAndUpdate({ username }, { status: UserStatus.OFFLINE });
    
    res.status(200).json({ message: "Logged Out!", success: true });
  } catch (err) {
    next(err);
  }
});


router.get('/verify-token/:token', async function (req, res, next) {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ error: "Token is required", success: false });

    const user = await User.findOne({ 
      password_reset_token: token,
      password_reset_token_expires_at: { $gt: Date.now() }
    });
    if (!user) return res.status(404).json({ message: "Token invalid", error: "Invalid or expired token.", success: false });
    
    res.status(200).json({ message: "Token is valid", success: true });
  } catch (err) {
    next(err);
  }
});

router.post('/reset-password', async function (req, res, next) {
  try {
    const { token, new_password } = req.body;
    if (!new_password || !token) return res.status(400).json({ error: "The fields 'new_password' and 'token' are required", success: false });

    const user = await User.findOne({ 
      password_reset_token: token,
      password_reset_token_expires_at: { $gt: Date.now() }
    });
    if (!user) return res.status(404).json({ message: "Resetting password failed", error: "Invalid or expired token.", success: false });

    user.password = new_password;
    user.password_reset_token = null;
    user.password_reset_token_expires_at = null;

    await user.save();
    
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
