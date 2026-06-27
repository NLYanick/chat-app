const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const InviteStatus = require('./enums/invite-status');

const roomInviteSchema = new mongoose.Schema({
    uid: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true,
    },
    room: {
        type: String,
        required: true,
    },
    invited: {
        type: String,
        required: true,
    },
    invited_by: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: InviteStatus.ALL,
        default: InviteStatus.PENDING,
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

mongoose.model("RoomInvite", roomInviteSchema);