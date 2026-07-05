const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { sendResetPasswordEmail } = require("./services/mail");
const FileType = require('./models/enums/file-type');

const User = mongoose.model('User');

const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

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

function saveParseJson(textBody) {
    try {
        return JSON.parse(textBody);
    } catch (err) {
        console.error("Error parsing request body:", err);
        return null;
    }
}

function resolveFileType(mimetype) {
    if (mimetype.startsWith('image/')) return FileType.IMAGE;
    if (mimetype.startsWith('video/')) return FileType.VIDEO;
    if (mimetype.startsWith('audio/')) return FileType.AUDIO;
    return FileType.FILE;
}

function createAccessToken(user) {
    return jwt.sign({ uid: user.uid }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

function createRefreshToken(user, remember) {
    return jwt.sign({ uid: user.uid, remember }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
}

function addCookieOptions(res, token, remember) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: remember ? COOKIE_MAX_AGE : undefined,
    };
    res.cookie('refresh_token', token, cookieOptions);
}

module.exports = { 
    setResetTokenAndSendEmail,
    userExistsInDb,
    saveParseJson,
    resolveFileType,
    createAccessToken,
    createRefreshToken,
    addCookieOptions
};