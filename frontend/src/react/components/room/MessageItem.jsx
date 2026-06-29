import { useState } from "react";
import { useAuth } from "../../AuthUserContext";
import { sendRequest } from "../../utils/requests";
import ProfileIcon from "../profile/ProfileIcon";
import MessageToolsBubble from "./MessageToolsBubble";
import Button from "../Button";
import { emitEvent } from "../../utils/socket-client";

function MessageItem({ message, member, onOpenModal }) {
  const [barVisible, setBarVisible] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);

  const { user } = useAuth();

  const formattedDate = new Date(message.created_at).toLocaleString().slice(0, 16).replace(',', ' ');

  const onEdit = async () => {
    if (!editText.trim() || editText.trim() === message.text) {
      setIsEditing(false);
      return;
    }

    try {
      const { json } = await sendRequest(`/messages/${message.uid}`, 'PUT', { text: editText });

      if (!json.success) {
        console.error("Failed to edit message:", json.error);
        return;
      }

      emitEvent('edit_message', { message_id: message.uid, text: editText, room_id: message.room });
    } catch (err) {
      console.error("Failed to edit message:", err);
    } finally {
      setIsEditing(false);
    }
  }

  const onDeleteClick = () => { 
    onOpenModal(message);
    setBarVisible(false); 
  }

  const onEditClicked = () => {
    setIsEditing(true);
    setBarVisible(false);
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    setEditText(message.text);
  }

  const onEditInputKeyDown = (e) => {
    if (e.key === 'Enter') onEdit();
    if (e.key === 'Escape') { setIsEditing(false); setEditText(message.text); }
  }
  
  return (
    <div 
      className={`relative flex ${member?.uid === user?.uid ? 'flex-row-reverse' : ''} gap-2 hover:bg-[#292929] p-2 rounded-md transition-colors duration-200`}
      onMouseEnter={() => setBarVisible(true)}
      onMouseLeave={() => setBarVisible(false)}
    >
      <div className="shrink-0">
        <ProfileIcon imgSrc={member?.avatar_url} size="sm" />
      </div>
      
      <div className={`flex flex-col ${member?.uid === user?.uid ? 'items-end' : 'items-start'} gap-1 w-[80%]`}>
        <span className="text-left">{member?.username || "Unknown User"} <span className="text-sm text-gray-300">| {formattedDate}</span></span>
        
        {isEditing ? (
          <div className="flex flex-col gap-2 w-full">
            <input 
              type="text"
              className="bg-gray-700 p-2 rounded-md border-2 border-gray-500 focus:outline-none w-full"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={onEditInputKeyDown}
              autoFocus
            />
            <div className="flex gap-2 text-xs">
              <button className="text-green-400 font-semibold cursor-pointer" onClick={onEdit}>Save</button>
              <button className="text-gray-400 cursor-pointer" onClick={onCancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="bg-(--primary-color-light) py-2 px-3 rounded-lg w-fit max-w-full">
            <p className="text-left">{message.text}</p>
          </div>
        )}

        {message.created_at !== message.updated_at && (
          <span className="text-xs text-gray-400">(Edited)</span>
        )}
      </div>

      {barVisible && member?.uid === user?.uid && (
        <MessageToolsBubble onEdit={onEditClicked} onDelete={onDeleteClick} />
      )}
    </div>
  )
}

export default MessageItem;