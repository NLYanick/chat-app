import ProfileIcon from "./profile/ProfileIcon";
import UserStatus from "../../enums/user-status";
import { Link } from "react-router-dom";

function FriendItem({ friend, onRemove }) {
  const statusClass = UserStatus.STATUS_STYLES[friend.status] || "bg-gray-500";

  const content = (
    <div className="flex items-center gap-3 size-full p-4">
      <div className="relative shrink-0">
        <ProfileIcon imgSrc={friend.avatar_url} size="small" />
        <div className={`w-3 h-3 rounded-full ${statusClass} absolute bottom-0 right-0 ring-2 ring-(--primary-color) ${friend.status === 'online' ? 'status-online' : ''}`} />
      </div>
      <span className="font-semibold truncate">{friend.username}</span>
    </div>
  );

  return (
    <li className="flex items-center justify-between bg-(--primary-color) border border-(--border-color) rounded-xl shadow-md transition-colors duration-150 animate-rise-in">
      {friend.disabled ? (
        content
      ) : (
        <Link to={`/profile/${friend.uid}`} className="flex-1 hover:bg-(--surface-2) rounded-l-xl transition-colors duration-150">
          {content}
        </Link>
      )}

      <button
        onClick={() => onRemove(friend.uid)}
        className="text-(--error-color) hover:brightness-125 cursor-pointer p-4 transition-transform duration-150 hover:scale-110 active:scale-95" 
      >
        Remove
      </button>
    </li>
  )
}

export default FriendItem;