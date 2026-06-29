const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const InviteStatus = require('../models/enums/invite-status');

const User = mongoose.model("User");

router.post('/:requestId/accept', async function(req, res, next) {
    try {
        const { requestId } = req.params;

        // const invite = await FriendRequest.findOne({ uid: requestId });
        // if (!invite) return res.status(404).json({ message: "Invite not found", error: "The specified invite does not exist", success: false });

        // if (invite.status !== InviteStatus.PENDING) return res.status(400).json({ message: "Invalid invite status", error: "This invite has already been responded to", success: false });

        // invite.status = InviteStatus.ACCEPTED;
        // await invite.save();

        // TODO: Add logic to add the invited user as a friend to the inviter's friend list and vice versa.

        res.status(200).json({ message: "Friend request accepted", success: true });
    } catch (err) {
        next(err);
    }
});

router.post('/:requestId/decline', async function(req, res, next) {
    try {
        const { requestId } = req.params;

        // const invite = await FriendRequest.findOne({ uid: requestId });
        // if (!invite) return res.status(404).json({ message: "Invite not found", error: "The specified invite does not exist", success: false });

        // if (invite.status !== InviteStatus.PENDING) return res.status(400).json({ message: "Invalid invite status", error: "This invite has already been responded to", success: false });

        // invite.status = InviteStatus.DECLINED;
        // await invite.save();

        res.status(200).json({ message: "Friend request declined", success: true });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
