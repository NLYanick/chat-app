const mongoose = require('mongoose');
const FileType = require('./enums/file-type');
const { v4: uuidv4 } = require('uuid');

const fileSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        default: uuidv4,
        unique: true
    },
    url: { 
        type: String, 
        required: true 
    },
    filename: String,
    storedName: String,
    mimetype: String,
    size: Number,
    type: {
        type: String,
        enum: FileType.ALL,
        default: 'file'
    },
    room: { 
        type: String, 
        required: true 
    },
    sender: { 
        type: String, 
        required: true 
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

mongoose.model("File", fileSchema);