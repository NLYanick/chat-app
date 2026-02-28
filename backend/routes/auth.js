const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const router = express.Router();

const User = mongoose.model('User');

router.post('/register', async function (req, res, next) {
  try {
    const { username, password, confirmPassword, staySignedIn } = req.body;

    // Extra backend validation
    if (!username || !password || !confirmPassword) return res.status(400).json({ message: "Registration failed", error: "The fields \"username\" and \"password\" are invalid.", success: false });
    if (password < 5) return res.status(400).json({ message: "Registration failed", error: "Password must be at least 5 characters long.", success: false });
    if (confirmPassword !== password) return res.status(400).json({ message: "Registration failed", error: "\"Confirm Password\" must be equal to \"Password\".", success: false });

    const existingUser = await User.findOne({ username });

    if (existingUser) return res.status(400).json({ message: "Registration failed", error: "Username already exists.", success: false });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      avatarURL: '',
      password_hash: hashedPassword,
      createdAt: new Date()
    });

    const userData = { 
      username: user.username, 
      avatar_url: user.avatarURL, 
      created_at: user.createdAt  
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
    
    const user = await User.findOne({ username }).select('+password_hash');
    if (!user) return res.status(404).json({ message: "Login failed", error: "Username doesn't exist.", success: false });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Invalid username or password", success: false });

    const userData = { 
      username: user.username, 
      avatar_url: user.avatarURL, 
      created_at: user.createdAt  
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
    
    res.status(200).json({ message: "Logged Out!", success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
