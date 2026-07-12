const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const InviteStatus = require('../models/enums/invite-status');

const RoomInvite = mongoose.model("RoomInvite");
const Room = mongoose.model("Room");
const User = mongoose.model("User");

router.post('/rooms/:roomId', async function(req, res, next) {
    try {
        const { roomId } = req.params;
        const { username, invited_by } = req.body;

        if (!username || !invited_by) return res.status(400).json({ message: "Bad Request", error: "The fields 'username' and 'invited_by' are required", success: false });

        const room = await Room.findOne({ uid: roomId });
        if (!room) return res.status(404).json({ message: "Room not found", error: "The specified room does not exist", success: false });
        if (!room.members.includes(invited_by)) return res.status(403).json({ message: "Forbidden", error: "You are not a member of this room", success: false });
        if (room.inactive) return res.status(403).json({ message: "Forbidden", error: "This room is inactive", success: false });

        const invitedUser = await User.findOne({ username });
        if (!invitedUser) return res.status(404).json({ message: "User not found", error: "The specified user does not exist", success: false });
        if (room.members.includes(invitedUser.uid)) return res.status(409).json({ message: "User already a member", error: "The specified user is already a member of this room", success: false });

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

router.post('/:inviteId/accept', async function(req, res, next) {
    try {
        const { inviteId } = req.params;

        const invite = await RoomInvite.findOne({ uid: inviteId });
        if (!invite) return res.status(404).json({ message: "Invite not found", error: "The specified invite does not exist", success: false });

        if (invite.status !== InviteStatus.PENDING) return res.status(400).json({ message: "Invalid invite status", error: "This invite has already been responded to", success: false });

        invite.status = InviteStatus.ACCEPTED;
        invite.processed_at = new Date();
        await invite.save();

        const room = await Room.findOne({ uid: invite.room });
        if (!room) return res.status(404).json({ message: "Room not found", error: "The specified room does not exist", success: false });
        
        if (!room.members.includes(invite.invited)) {
            room.members.push(invite.invited);
            await room.save();
        }

        res.status(200).json({ message: "Invite accepted", success: true });
    } catch (err) {
        next(err);
    }
});

router.post('/:inviteId/decline', async function(req, res, next) {
    try {
        const { inviteId } = req.params;

        const invite = await RoomInvite.findOne({ uid: inviteId });
        if (!invite) return res.status(404).json({ message: "Invite not found", error: "The specified invite does not exist", success: false });

        if (invite.status !== InviteStatus.PENDING) return res.status(400).json({ message: "Invalid invite status", error: "This invite has already been responded to", success: false });

        invite.status = InviteStatus.DECLINED;
        invite.processed_at = new Date();
        await invite.save();

        res.status(200).json({ message: "Invite declined", success: true });
    } catch (err) {
        next(err);
    }
});

router.get('/user/:userId', async function(req, res, next) {
    try {
        const { userId } = req.params;

        const invites = await RoomInvite.find({ invited: userId, status: InviteStatus.PENDING })
                                .populate('room_details')
                                .populate('inviter_details')
                                .populate('invited_user_details');

        res.status(200).json({ message: "Invites fetched", invites, success: true });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
