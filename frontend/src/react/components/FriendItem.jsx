import ProfileIcon from "./profile/ProfileIcon";

function FriendItem({ friend, onRemove }) {
  return (
    <li className="flex items-center justify-between p-4 bg-(--primary-color) rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <ProfileIcon imgSrc={friend.avatar_url} size="sm" />
        <span className="font-semibold">{friend.username}</span>
      </div>
      <button className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => onRemove(friend.uid)}>
        Remove
      </button>
    </li>
  )  
}

export default FriendItem;