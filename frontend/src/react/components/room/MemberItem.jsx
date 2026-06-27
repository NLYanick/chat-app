import ProfileIcon from "../profile/ProfileIcon"

const STATUS_STYLES = {
  online: "bg-green-500",
  offline: "bg-gray-500",
  away: "bg-yellow-500",
}

function MemberItem({ member, isOwner }) {
  const statusClass = STATUS_STYLES[member.status] || "bg-gray-500";

  const handleClick = () => {
    // Handle click event for the member item
    console.log(`Clicked on member: ${member.username}`);
  }

  return (
    <>
      <li 
        className={`rounded-lg shadow-lg py-2 border-2 ${isOwner ? "border-yellow-500" : "border-gray-300"} flex items-center justify-between px-4`}
      >
        <ProfileIcon imgSrc={member.avatar_url} />
        <p>{member.username}</p>
        <div className={`min-w-3 min-h-3 rounded-full ${statusClass}`} />
      </li>
    </>
  )
}

export default MemberItem