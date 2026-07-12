const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const DEFAULT_ROOM_COLOR = "#343434";

const roomSchema = new mongoose.Schema({
    uid: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    description: {
        type: String,
        maxlength: 500
    },
    owner: String,
    members: [{ 
        type: String
    }],
    color_hex: {
        type: String,
        required: false,
        default: DEFAULT_ROOM_COLOR
    },
    image: String,
    inactive: {
        type: Boolean, 
        default: false
    },
    inactive_at: {
        type: Date,
        default: null
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const seconds = 30 * 24 * 60 * 60; // 30 days in seconds
roomSchema.index({ archivedAt: 1 }, { expireAfterSeconds: seconds });

roomSchema.virtual('members_details', {
  ref: 'User',
  localField: 'members',
  foreignField: 'uid',
  justOne: false
});

roomSchema.set('toObject', { virtuals: true });
roomSchema.set('toJSON', { virtuals: true });

mongoose.model("Room", roomSchema);
