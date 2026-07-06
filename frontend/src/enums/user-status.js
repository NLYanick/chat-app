class UserStatus {
    static ONLINE = "online";
    static AWAY = "away";
    static OFFLINE = "offline";
    
    static ALL = [
        UserStatus.ONLINE, 
        UserStatus.AWAY, 
        UserStatus.OFFLINE
    ];

    static containsStatus(value) {
        return UserStatus.ALL.includes(value);
    }

    static STATUS_STYLES = {
        online: "bg-green-500",
        offline: "bg-gray-500",
        away: "bg-yellow-500",
    }
}

export default UserStatus;