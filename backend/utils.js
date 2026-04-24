const crypto = require('crypto');
const mongoose = require('mongoose');
const { sendResetPasswordEmail } = require("./services/mail");

const User = mongoose.model('User');

async function setResetTokenAndSendEmail(user) {
    user.password_reset_token = crypto.randomBytes(32).toString("hex");
    user.password_reset_token_expires_at = new Date(Date.now() + 3600 * 1000); // seconds * milliseconds
    await user.save();

    await sendResetPasswordEmail(user);
}

async function userExistsInDb(userData, excludeUserId = null) {
    const query = {
        $or: [
            { username: userData.username },
            { email: userData.email }
        ]
    };
    
    if (excludeUserId) {
        query.uid = { $ne: excludeUserId };
    }
    
    const user = await User.findOne(query);
    return user !== null;
}

module.exports = { 
    setResetTokenAndSendEmail,
    userExistsInDb
};