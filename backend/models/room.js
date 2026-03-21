const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    room_name: String,
    created_at: Date,
    members: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]
});

mongoose.model("Room", roomSchema);
