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
}

export default UserStatus;