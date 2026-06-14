const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const UserStatus = require('./enums/user-status');

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true,
    },
    username: { 
        required: true, 
        type: String, 
        unique: true, 
        trim: true 
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    avatar_url: String,
    status: {
        enum: [UserStatus.ONLINE, UserStatus.AWAY, UserStatus.OFFLINE],
        type: String,
        default: UserStatus.OFFLINE
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    password_reset_token: { 
        type: String,
        default: undefined,
        select: false 
    },
    password_reset_token_expires_at: { 
        type: Date,
        default: undefined,
        select: false 
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Hash the password
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
});

mongoose.model("User", userSchema);
