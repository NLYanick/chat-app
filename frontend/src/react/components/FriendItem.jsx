import ProfileIcon from "./profile/ProfileIcon";
import UserStatus from "../../enums/user-status";
import { Link } from "react-router-dom";

function FriendItem({ friend, onRemove }) {
  const statusClass = UserStatus.STATUS_STYLES[friend.status] || "bg-gray-500";

  return (
    <li className="flex items-center justify-between bg-(--primary-color) rounded-lg shadow-md">
      {friend.disabled ? (
        <div className="flex items-center gap-2 size-full p-4">
          <ProfileIcon imgSrc={friend.avatar_url} size="sm" />
          <div className={`min-w-3 min-h-3 rounded-full ${statusClass}`} />
          <span className="font-semibold truncate">{friend.username}</span>
        </div>
      ) : (
        <Link to={`/profile/${friend.uid}`} className="flex items-center gap-2 size-full p-4 hover:bg-(--primary-color-light) rounded-l-lg">
          <ProfileIcon imgSrc={friend.avatar_url} size="sm" />
          <div className={`min-w-3 min-h-3 rounded-full ${statusClass}`} />
          <span className="font-semibold truncate">{friend.username}</span>
        </Link>
      )}

      <button className="text-red-500 hover:text-red-700 cursor-pointer p-4" onClick={() => onRemove(friend.uid)}>
        Remove
      </button>
    </li>
  )  
}

export default FriendItem;