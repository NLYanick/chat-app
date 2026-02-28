const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        required: true, 
        type: String, 
        unique: true, 
        trim: true 
    },
    avatarURL: String,
    password_hash: {
        type: String,
        required: true,
        select: false
    },
    createdAt: { 
        required: true, 
        type: Date 
    }
});

mongoose.model("User", userSchema);
