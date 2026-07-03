import ProfileIcon from "./profile/ProfileIcon";
import UserStatus from "../../enums/user-status";

function FriendItem({ friend, onRemove }) {
  const statusClass = UserStatus.STATUS_STYLES[friend.status] || "bg-gray-500";

  return (
    <li className="flex items-center justify-between p-4 bg-(--primary-color) rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <ProfileIcon imgSrc={friend.avatar_url} size="sm" />
        <div className={`min-w-3 min-h-3 rounded-full ${statusClass}`} />
        <span className="font-semibold truncate">{friend.username}</span>
      </div>
      <button className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => onRemove(friend.uid)}>
        Remove
      </button>
    </li>
  )  
}

export default FriendItem;