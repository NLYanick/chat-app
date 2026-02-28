const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: String,
    timestamp: Date,
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    room: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room' 
    }
});

mongoose.model("Message", messageSchema);
