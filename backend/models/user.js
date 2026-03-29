const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

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
    password_hash: {
        type: String,
        required: true,
        select: false
    },
    password_reset_token: { 
        type: String,
        required: true,
        select: false 
    },
    created_at: { 
        required: true, 
        type: Date 
    }
});

mongoose.model("User", userSchema);
