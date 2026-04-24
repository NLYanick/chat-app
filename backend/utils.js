const crypto = require('crypto');
const { sendResetPasswordEmail } = require("./services/mail");

async function setResetTokenAndSendEmail(user) {
    user.password_reset_token = crypto.randomBytes(32).toString("hex");
    user.password_reset_token_expires_at = new Date(Date.now() + 3600 * 1000); // seconds * milliseconds
    await user.save();

    await sendResetPasswordEmail(user);
}

module.exports = { 
    setResetTokenAndSendEmail 
};