const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { setResetTokenAndSendEmail } = require('../utils');

const User = mongoose.model('User');

router.post('/reset-password', async (req, res, next) => {
  try {
    if (!req.body || !req.body.userUid) 
      return res.status(400).json({ error: "Bad Request. The field 'userUid' is required.", success: false });

    const user = await User.findOne({ uid: req.body.userUid }).select("+password_reset_token");
    if (!user) return res.status(404).json({ error: "User not found", success: false });

    await setResetTokenAndSendEmail(user);

    res.status(202).json({ message: "Mail sent successfully!", success: true });
  } catch (err) {
    next(err);
  }
});
router.post('/forgot-password', async (req, res, next) => {
  try {
    if (!req.body || !req.body.email) 
      return res.status(400).json({ error: "Bad Request. The field 'email' is required.", success: false });

    const user = await User.findOne({ email: req.body.email }).select("+password_reset_token");
    if (!user) return res.status(404).json({ error: "User not found", success: false });

    await setResetTokenAndSendEmail(user);

    res.status(202).json({ message: "Mail sent successfully!", success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
