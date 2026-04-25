const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const roomSchema = new mongoose.Schema({
    uid: {
        type: String,
        default: uuidv4(),
        unique: true,
        required: true
    },
    room_name: String,
    members: [{ 
        type: String
    }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

mongoose.model("Room", roomSchema);
