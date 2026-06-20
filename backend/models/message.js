const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const messageSchema = new mongoose.Schema({
    uid: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true
    },
    text: String,
    sender: String,
    room: String, 
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

mongoose.model("Message", messageSchema);
