const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const InviteStatus = require('./enums/invite-status');

const friendRequestSchema = new mongoose.Schema({
    uid: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
    recipient: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: InviteStatus.ALL,
        default: InviteStatus.PENDING,
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

friendRequestSchema.set('toObject', { virtuals: true });
friendRequestSchema.set('toJSON', { virtuals: true });

friendRequestSchema.virtual('sender_details', {
  ref: 'User',
  localField: 'sender',
  foreignField: 'uid',
  justOne: true
});

friendRequestSchema.virtual('recipient_details', {
  ref: 'User',
  localField: 'recipient',
  foreignField: 'uid',
  justOne: true
});


mongoose.model("FriendRequest", friendRequestSchema);