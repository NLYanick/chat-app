import { Link } from "react-router-dom";
import UserStatus from "../../../enums/user-status";
import ProfileIcon from "../profile/ProfileIcon"

function MemberItem({ member, isOwner }) {
  const statusClass = UserStatus.STATUS_STYLES[member.status] || "bg-gray-500";

  return (
    <>
      <li>
        {member.disabled ? (
          <div className={`rounded-lg shadow-lg py-2 border-2 ${isOwner ? "border-yellow-500" : "border-gray-300"} flex items-center justify-between px-4`}>
            <ProfileIcon imgSrc={member.avatar_url} />
            <p>{member.username}</p>
            <div className={`min-w-3 min-h-3 rounded-full ${statusClass}`} />
          </div>
        ) : (
          <Link to={`/profile/${member.uid}`} className={`rounded-lg shadow-lg py-2 border-2 ${isOwner ? "border-yellow-500" : "border-gray-300"} flex items-center justify-between px-4 hover:bg-(--primary-color-light) rounded-l-lg`}>
            <ProfileIcon imgSrc={member.avatar_url} />
            <p>{member.username}</p>
            <div className={`min-w-3 min-h-3 rounded-full ${statusClass}`} />
          </Link>
        )}
      </li>
    </>
  )
}

export default MemberItem