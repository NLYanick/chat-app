import { useState } from "react";
import { useAuth } from "../../AuthUserContext";
import { sendRequest } from "../../utils/requests";
import ProfileIcon from "../profile/ProfileIcon";
import MessageToolsBubble from "./MessageToolsBubble";
import Modal from "../Modal";
import Button from "../Button";
import { emitEvent } from "../../utils/socket-client";

function MessageItem({ message, member }) {
  const [barVisible, setBarVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();

  const formattedDate = new Date(message.created_at).toLocaleString().slice(0, 16).replace(',', ' ');

  const onEdit = async () => {
    console.log("Edit message:", message);
    // const { json } = await sendRequest(`/messages/${message.uid}`, 'PUT', { text: null });

    emitEvent('edit_message', { message_id: message.uid, text: message.text, room_id: message.room });
  }

  const onDelete = async () => {
    const { json } = await sendRequest(`/messages/${message.uid}`, 'DELETE');

    if (!json.success) {
      console.error("Failed to delete message:", json.error);
      return;
    }

    emitEvent('delete_message', { message_id: message.uid, room_id: message.room });
    
    setShowModal(false);
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
        
        <div className="bg-(--primary-color-light) py-2 px-3 rounded-lg w-fit max-w-full wrap-break-word">
          <p className="text-left">{message.text}</p>
        </div>

        {message.created_at !== message.updated_at && (
          <span className="text-xs text-gray-400">(Edited)</span>
        )}
      </div>

      {barVisible && member?.uid === user?.uid && (
        <MessageToolsBubble onEdit={onEdit} onDelete={() => setShowModal(true)} />
      )}

      {showModal && (
        <Modal 
          onClose={() => setShowModal(false)}
          footer={
            <div className="flex gap-2 justify-end">
              <Button type="secondary" label="Cancel" onClick={() => setShowModal(false)} />
              <Button type="error" label="Delete" onClick={onDelete} />
            </div>
          }
        >
          <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
          <p>Are you sure you want to delete this message?</p>
          <p className="text-sm text-gray-300 italic truncate w-full">"{message.text}"</p>
        </Modal>
      )}
    </div>
  )
}

export default MessageItem;