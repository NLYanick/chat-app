const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: String,
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    room: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room' 
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

mongoose.model("Message", messageSchema);
