class InviteStatus {
    static PENDING = "pending";
    static ACCEPTED = "accepted";
    static DECLINED = "declined";

    static ALL = [
        InviteStatus.PENDING,
        InviteStatus.ACCEPTED,
        InviteStatus.DECLINED
    ];

    static containsStatus(value) {
        return InviteStatus.ALL.includes(value);
    }
}

module.exports = InviteStatus;