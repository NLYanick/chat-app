import ProfileIcon from "./profile/ProfileIcon";

function FriendItem({ friend }) {
  return (
    <li className="flex items-center justify-between p-4 bg-(--primary-color) rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <ProfileIcon imgSrc={friend.avatar_url} size="sm" />
        <span className="font-semibold">{friend.username}</span>
      </div>
    </li>
  )  
}

export default FriendItem;