import { useState } from "react";
import { useAuth } from "../../../AuthUserContext";
import { sendRequest } from "../../../../utils/requests";
import { emitEvent } from "../../../../utils/socket-client";
import ProfileIcon from "../../profile/ProfileIcon";
import MessageToolsBubble from "./MessageToolsBubble";
import Button from "../../Button";
import AttachmentPreview from "./AttachmentPreview";
import FileUploadItem from "./FileUploadItem";

function MessageItem({ message, member, onOpenModal, isEditing, setIsEditing, setSelectedAttachment }) {
  const [barVisible, setBarVisible] = useState(false);

  const [editText, setEditText] = useState(message.text);
  const [editFiles, setEditFiles] = useState(message.attachments_details || []);

  const { user } = useAuth();

  const createdDate = new Date(message.created_at);
  const formattedDate = createdDate.toLocaleDateString() + ' ' + createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const canNotEdit = () => {
    return (!editText.trim() && !message.attachments) 
        || (editText.trim() === message.text && editFiles.length === message.attachments_details?.length)
        || (!editText.trim() && editFiles.length === 0)
  }
  
  const onEdit = async () => {
    if (canNotEdit()) {
      setIsEditing(false);
      setEditText(message.text);
      return;
    }

    try {
      const { json } = await sendRequest(`/messages/${message.uid}`, 'PUT', { text: editText, attachments: editFiles.map(file => file.uid) });

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
    setEditFiles(message.attachments_details || []);
  }

  const onEditInputKeyDown = (e) => {
    if (e.key === 'Enter') onEdit();
    if (e.key === 'Escape') { setIsEditing(false); setEditText(message.text); }
  }

  const removeFileFromMessage = (index) => {
    if (!canNotEdit()) {
      setEditFiles(prev => prev.filter((_, i) => i !== index));
    }
  };
  
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
          <>
            {editFiles?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {editFiles.map((file, index) => (
                  <FileUploadItem 
                    key={`${file.name}-${file.size}-${index}`}
                    file={file} 
                    onRemove={removeFileFromMessage} 
                    index={index} 
                  />
                ))}
              </div>
            )}
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
                <button className={`text-green-400 font-semibold cursor-pointer ${canNotEdit() ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={onEdit} disabled={canNotEdit()}>
                  Save
                </button>
                <button className="text-gray-400 cursor-pointer" onClick={onCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {message.text && (
              <div className="bg-(--primary-color-light) py-2 px-3 rounded-lg w-fit max-w-full">
                <p className="text-left">{message.text}</p>
              </div>
            )}
 
            {editFiles?.length > 0 && (
              <div className="flex flex-wrap gap-2 w-fit max-w-full relative">
                {editFiles.map((attachment, index) => (
                  <AttachmentPreview
                    key={`${message.uid}-attachment-${index}`}
                    attachment={attachment}
                    onClick={() => setSelectedAttachment(attachment)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {message.created_at !== message.updated_at && (
          <span className="text-xs text-gray-400">(Edited)</span>
        )}
      </div>

      {barVisible && member?.uid === user?.uid && !isEditing && (
        <MessageToolsBubble onEdit={onEditClicked} onDelete={onDeleteClick} />
      )}
    </div>
  )
}

export default MessageItem;