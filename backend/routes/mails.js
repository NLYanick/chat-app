const express = require('express');
const router = express.Router();
const { sendResetPasswordEmail } = require('../services/mail');
const mongoose = require('mongoose');
const crypto = require('crypto');

const User = mongoose.model('User');

router.post('/reset-password', async (req, res, next) => {
  try {
    if (!req.body || !req.body.userUid) 
      return res.status(400).json({ error: "Bad Request. The field 'userUid' is required.", success: false });

    const user = await User.findOne({ uid: req.body.userUid }).select("+password_reset_token");
    if (!user) return res.status(404).json({ error: "User not found", success: false });

    user.password_reset_token = crypto.randomBytes(32).toString("hex");
    user.password_reset_token_expires_at = new Date(Date.now() + 3600 * 1000); // seconds * milliseconds
    await user.save();

    await sendResetPasswordEmail(user);

    res.status(202).json({ message: "Mail sent successfully!", success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
