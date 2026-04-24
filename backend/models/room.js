const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    room_name: String,
    members: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

mongoose.model("Room", roomSchema);
