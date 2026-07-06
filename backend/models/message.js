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
    attachments: [{
        type: String,
    }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

messageSchema.virtual('attachments_details', {
    ref: 'File',
    localField: 'attachments',
    foreignField: 'uid',
    justOne: false
});

messageSchema.set('toObject', { virtuals: true });
messageSchema.set('toJSON', { virtuals: true });

mongoose.model("Message", messageSchema);
