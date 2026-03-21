const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        required: true, 
        type: String, 
        unique: true, 
        trim: true 
    },
    avatar_url: String,
    password_hash: {
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
