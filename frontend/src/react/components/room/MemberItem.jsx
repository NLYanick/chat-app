import { Link } from "react-router-dom";
import UserStatus from "../../../enums/user-status";
import ProfileIcon from "../profile/ProfileIcon"

function MemberItem({ member, isOwner }) {
  const statusClass = UserStatus.STATUS_STYLES[member.status] || "bg-gray-500";

  const content = (
    <div className={`rounded-xl shadow-md border-2 ${isOwner ? "border-(--warning-color)" : "border-(--border-color)"} flex items-center gap-3 px-4 py-2.5 transition-colors duration-150`}>
      <div className="relative shrink-0">
        <ProfileIcon imgSrc={member.avatar_url} size="small" />
        <div className={`w-3 h-3 rounded-full ${statusClass} absolute bottom-0 right-0 ring-2 ring-(--primary-color-light) ${member.status === 'online' ? 'status-online' : ''}`} />
      </div>
      <p className="flex-1 truncate">{member.username}</p>
      {isOwner && (
        <span className="text-xs uppercase tracking-wide text-(--warning-color) font-semibold shrink-0">Owner</span>
      )}
    </div>
  );

  return (
    <li className="animate-rise-in">
      {member.disabled ? (
        content
      ) : (
        <Link to={`/profile/${member.uid}`} className="block hover:bg-(--surface-2) rounded-xl transition-colors duration-150">
          {content}
        </Link>
      )}
    </li>
  )
}

export default MemberItem