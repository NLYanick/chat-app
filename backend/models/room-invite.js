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

roomInviteSchema.set('toObject', { virtuals: true });
roomInviteSchema.set('toJSON', { virtuals: true });


roomInviteSchema.virtual('room_details', {
  ref: 'Room',
  localField: 'room',
  foreignField: 'uid',
  justOne: true
});

roomInviteSchema.virtual('invited_user_details', {
  ref: 'User',
  localField: 'invited',
  foreignField: 'uid',
  justOne: true
});

roomInviteSchema.virtual('inviter_details', {
  ref: 'User',
  localField: 'invited_by',
  foreignField: 'uid',
  justOne: true
});

mongoose.model("RoomInvite", roomInviteSchema);