import ProfileIcon from "../profile/ProfileIcon";

function MessageItem({ message, member }) {
  return (
    <div className="flex items-start gap-2 mb-2">
      <div className="shrink-0">
        <ProfileIcon user={member} size="sm" />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold">{member?.username || "Unknown User"}</span>
        <p className="text-left">{message.text}</p>
      </div>
    </div>
  )
}

export default MessageItem;