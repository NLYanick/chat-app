const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const InviteStatus = require('../models/enums/invite-status');

const RoomInvite = mongoose.model("RoomInvite");
const Room = mongoose.model("Room");
const User = mongoose.model("User");

router.post('/rooms/:roomId/invite', async function(req, res, next) {
    try {
        const { roomId } = req.params;
        const { username, invited_by } = req.body;

        if (!username || !invited_by) return res.status(400).json({ message: "Bad Request", error: "The fields 'username' and 'invited_by' are required", success: false });

        const room = await Room.findOne({ uid: roomId });
        if (!room) return res.status(404).json({ message: "Room not found", error: "The specified room does not exist", success: false });

        const invitedUser = await User.findOne({ username });
        if (!invitedUser) return res.status(404).json({ message: "User not found", error: "The specified user does not exist", success: false });

        const invitedByUser = await User.findOne({ uid: invited_by });
        if (!invitedByUser) return res.status(404).json({ message: "Inviter not found", error: "The user who is inviting does not exist", success: false });

        const existingInvite = await RoomInvite.findOne({ room: roomId, invited: invitedUser.uid, status: InviteStatus.PENDING });
        if (existingInvite) return res.status(409).json({ message: "Invite already exists", error: "An invite for this user to this room already exists", success: false });
    
        const invite = await RoomInvite.create({
            room: roomId,
            invited: invitedUser.uid,
            invited_by: invited_by,
            status: InviteStatus.PENDING
        });

        res.status(201).json({ message: "Invite created", data: invite, success: true });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
