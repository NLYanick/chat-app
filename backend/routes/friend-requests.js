const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const InviteStatus = require('../models/enums/invite-status');

const FriendRequest = mongoose.model("FriendRequest");
const User = mongoose.model("User");

router.post('/', async function(req, res, next) {
    try {
        const { sender_id, recipient_name } = req.body;

        const sender = await User.findOne({ uid: sender_id });
        const recipient = await User.findOne({ username: recipient_name });
        if (!sender || !recipient) return res.status(404).json({ message: "User not found", error: "The specified user does not exist", success: false });

        const existingRequest = await FriendRequest.findOne({ sender: sender.uid, recipient: recipient.uid });
        if (existingRequest) return res.status(409).json({ message: "Friend request already sent", error: "A friend request has already been sent to this user", success: false });

        await FriendRequest.create({
            sender: sender.uid,
            recipient: recipient.uid
        });

        res.status(201).json({ message: "Friend request sent", success: true });
    } catch (err) {
        next(err);
    }
});

router.get('/user/:recipient_id', async function(req, res, next) {
    try {
        const { recipient_id } = req.params;

        const friendRequests = await FriendRequest.find({ recipient: recipient_id, status: InviteStatus.PENDING })
                                    .populate('sender_details')
                                    .populate('recipient_details');

        res.status(200).json({ friend_requests: friendRequests, success: true });
    } catch (err) {
        next(err);
    }
});

router.post('/:id/accept', async function(req, res, next) {
    try {
        const { id } = req.params;

        const request = await FriendRequest.findOne({ uid: id });
        if (!request) return res.status(404).json({ message: "Friend request not found", error: "The specified friend request does not exist", success: false });

        if (request.status !== InviteStatus.PENDING) return res.status(400).json({ message: "Invalid friend request status", error: "This friend request has already been responded to", success: false });

        request.status = InviteStatus.ACCEPTED;
        await request.save();

        await User.findOneAndUpdate({ uid: request.sender }, { $addToSet: { friends: request.recipient } });
        await User.findOneAndUpdate({ uid: request.recipient }, { $addToSet: { friends: request.sender } });

        res.status(200).json({ message: "Friend request accepted", success: true });
    } catch (err) {
        next(err);
    }
});

router.post('/:id/decline', async function(req, res, next) {
    try {
        const { id } = req.params;

        const request = await FriendRequest.findOne({ uid: id });
        if (!request) return res.status(404).json({ message: "Friend request not found", error: "The specified friend request does not exist", success: false });

        if (request.status !== InviteStatus.PENDING) return res.status(400).json({ message: "Invalid friend request status", error: "This friend request has already been responded to", success: false });

        request.status = InviteStatus.DECLINED;
        await request.save();

        res.status(200).json({ message: "Friend request declined", success: true });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
