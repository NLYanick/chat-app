import ProfileIcon from "../profile/ProfileIcon"

function MemberItem({ member, isOwner }) {
  const statusStyles = {
    online: "bg-green-500",
    offline: "bg-gray-500",
    away: "bg-yellow-500",
  }

  const statusClass = statusStyles[member.status] || "bg-gray-500";
  return (
    <li className={`rounded-lg shadow-lg py-2 border-2 ${isOwner ? "border-yellow-500" : "border-gray-300"} flex items-center justify-between px-4`}>
      <ProfileIcon imgSrc={member.avatar_url} />
      <p>{member.username}</p>
      <div className={`min-w-3 min-h-3 rounded-full ${statusClass}`} />
    </li>
  )
}

export default MemberItem