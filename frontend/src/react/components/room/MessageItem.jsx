import { useAuth } from "../../AuthUserContext";
import ProfileIcon from "../profile/ProfileIcon";

function MessageItem({ message, member }) {
  const { user } = useAuth();

  const formattedDate = new Date(message.updated_at).toTimeString().slice(0, 5);

  return (
    <div className={`flex ${member?.uid === user?.uid ? 'flex-row-reverse' : ''} gap-2 mb-2`}>
      <div className="shrink-0">
        <ProfileIcon imgSrc={member?.avatar_url} size="sm" />
      </div>
      <div className={`flex flex-col ${member?.uid === user?.uid ? 'items-end' : 'items-start'} gap-1 w-full`}>
        
        <span className="text-left">{member?.username || "Unknown User"} <span className="text-sm text-gray-300">| {formattedDate}</span></span>
        
        <div className="bg-(--primary-color-light) py-2 px-3 rounded-lg w-fit max-w-[80%] wrap-break-word">
          <p className="text-left">{message.text}</p>
        </div>
      </div>
    </div>
  )
}

export default MessageItem;