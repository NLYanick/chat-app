import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../AuthUserContext";
import { emitEvent, subscribeToEvent } from "../../../../utils/socket-client";
import { sendRequest } from "../../../../utils/requests";
import Button from "../../Button";
import MessageItem from "./MessageItem";
import FileUploadItem from "./FileUploadItem";
import Modal from "../../Modal";
import AttachmentPreview from "./AttachmentPreview";
// import MessagesSkeleton from "../../skeletons/MessagesSkeleton";

function MessagesPane({ room, members }) {
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const [newMessage, setNewMessage] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [error, setError] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [editingMessageId, setEditingMessageId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  const [typingUsers, setTypingUsers] = useState([]);

  const { user } = useAuth();

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    let unsubscribeSend;
    let unsubscribeEdit;
    let unsubscribeDelete;

    let unsubscribeTypingStarted;
    let unsubscribeTypingStopped;

    setNewMessage("");
    setNewFiles([]);
    setMessagesLoading(true);

    async function fetchMessages() {
      try {
        const { json } = await sendRequest(`/messages/rooms/${room?.uid}`, 'GET');
        if (!json.success) {
          setError(`Could not load messages: ${json.error}`);
          return;
        }

        setMessages(json.messages);

        unsubscribeSend = subscribeToEvent('message_sent', ({ message, room_id, attachments }) => {
          if (room_id === room?.uid) {
            setMessages(prev => {
              const exists = prev.some(m => m.uid === message.uid);
              if (exists) return prev;
              return [...prev, message];
            });
          }
        });
        unsubscribeEdit = subscribeToEvent('message_edited', ({ message_id, text, room_id, updated_at }) => {
          if (room_id === room?.uid) {
            setMessages(prev => {
              return prev.map(m => m.uid === message_id ? { ...m, text, updated_at } : m);
            });
          }
        });
        unsubscribeDelete = subscribeToEvent('message_deleted', ({ message_id, room_id }) => {
          if (room_id === room?.uid) {
            setMessages(prev => {
              return prev.filter(m => m.uid !== message_id);
            });
          }
        });
        unsubscribeTypingStarted = subscribeToEvent('typing_started', ({ room_id, username }) => {
          if (room_id === room?.uid) {
            setTypingUsers(prev => prev.includes(username) ? prev : [...prev, username]);
          }
        });
        unsubscribeTypingStopped = subscribeToEvent('typing_stopped', ({ room_id, username }) => {
          if (room_id === room?.uid) {
            setTypingUsers(prev => prev.filter(u => u !== username));
          }
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setMessagesLoading(false);
      }
    }

    fetchMessages();

    return () => {
      if (unsubscribeSend) unsubscribeSend()
      if (unsubscribeEdit) unsubscribeEdit()
      if (unsubscribeDelete) unsubscribeDelete()
      if (unsubscribeTypingStarted) unsubscribeTypingStarted()
      if (unsubscribeTypingStopped) unsubscribeTypingStopped()
    };
  }, [room?.uid]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // -------- File Selection --------

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList);
    if (incoming.length === 0) return;

    setNewFiles(prev => {
      const existingKeys = new Set(prev.map(f => `${f.name}-${f.size}`));
      const deduped = incoming.filter(f => !existingKeys.has(`${f.name}-${f.size}`));
      return [...prev, ...deduped];
    });
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const removeNewFile = (index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  // -------- Drag and Drop --------

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current += 1;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current -= 1;

    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);

    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  // -------- Sending Messages --------

  const handleSendMessage = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed && newFiles.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('text', trimmed);
      formData.append('sender', user.uid);
      
      if (newFiles.length > 0) {
        newFiles.forEach(file => formData.append('files', file));
      }

      const { json } = await sendRequest(`/messages/rooms/${room?.uid}`, 'POST', formData);
      
      if (!json.success) {
        setError("Failed to send message: " + (json.error || "Unknown error"));
        return;
      }

      emitEvent('send_message', { message: json.data, room_id: room?.uid });
      emitEvent('stopped_typing', { room_id: room?.uid, username: user.username });

      setMessages(prev => [...prev, json.data]);
      setNewMessage("");
      setNewFiles([]);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("An error occurred while sending the message.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDelete = async () => {
    try {
      const { json } = await sendRequest(`/messages/${selectedMessage?.uid}`, 'DELETE');

      if (!json.success) {
        console.error("Failed to delete message:", json.error);
        return;
      }

      emitEvent('delete_message', { message_id: selectedMessage?.uid, room_id: selectedMessage?.room });
    } catch (err) {
      console.error("Failed to delete message:", err);
    } finally {
      setShowModal(false);
    }
  }

  const onOpenModal = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  }

  const onTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (value.trim() !== "") {
      emitEvent('started_typing', { room_id: room?.uid, username: user.username });
    } else {
      emitEvent('stopped_typing', { room_id: room?.uid, username: user.username });
    }
  }

  return (
    <div
      className='grid grid-rows-[1fr_auto] h-full relative'
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-(--secondary-color)/20 border-4 border-dashed border-(--secondary-color) rounded-md pointer-events-none animate-fade-in">
          <p className="text-xl font-bold text-(--primary-color) bg-white/90 px-4 py-2 rounded-md shadow-xl animate-pop-in">
            Drop files to attach
          </p>
        </div>
      )}
 
      <div className='flex flex-col gap-4 py-4 h-full overflow-y-scroll overflow-x-hidden app-scrollbar'>
        <h1 className='text-3xl sm:text-4xl font-bold my-6'>Welcome to {room?.name || 'the room'}</h1>

        {messagesLoading ? (
          // <MessagesSkeleton />
          <p>Loading...</p>
        ) : (
          <>
            {messages.length === 0 && (
              <p className="text-(--text-muted)">No messages yet. Start the conversation!</p>
            )}
            {messages.length > 0 && (
              messages.map((message) => (
                <MessageItem 
                  key={message.uid} 
                  message={message} 
                  member={members?.find(m => m.uid === message.sender)} 
                  onOpenModal={onOpenModal}
                  isEditing={editingMessageId === message.uid}
                  setIsEditing={(editing) => setEditingMessageId(editing ? message.uid : null)}
                  setSelectedAttachment={setSelectedAttachment}
                />
              ))
            )}
          </>
        )}
        {error && <p className='text-(--error-color) animate-rise-in'>{error}</p>}
 
        <div ref={messagesEndRef} />
 
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
            <p className="text-sm text-(--text-muted) italic truncate w-full">"{selectedMessage?.text}"</p>
          </Modal>
        )}

        {selectedAttachment && (
          <div className='fixed inset-0 bg-[#000000AA] flex justify-center items-center z-50 animate-fade-in' onClick={() => setSelectedAttachment(null)}>
            <div className="animate-pop-in">
              <AttachmentPreview attachment={selectedAttachment} previewSize="large" />
            </div>
          </div>
        )}
      </div>
 
      <div className="p-4 flex flex-col gap-2">
        {typingUsers.length > 0 && (
          <p className="text-sm text-(--text-muted) flex items-center gap-2 animate-fade-in">
            <span className="flex gap-0.5">
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-(--secondary-color)" style={{ animationDelay: '0ms' }} />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-(--secondary-color)" style={{ animationDelay: '150ms' }} />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-(--secondary-color)" style={{ animationDelay: '300ms' }} />
            </span>
            {typingUsers.length <= 2 
              ? typingUsers.join(', ').concat(' ') 
              : typingUsers.slice(0, 2).join(', ') + ` and ${typingUsers.length - 2} more `
            } 
            {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </p>
        )}

        {newFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {newFiles.map((file, index) => (
              <FileUploadItem 
                key={`${file.name}-${file.size}-${index}`}
                file={file} 
                onRemove={removeNewFile} 
                index={index} 
              />
            ))}
          </div>
        )}
 
        <div className="flex gap-2 items-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
          />
          <Button
            type="secondary"
            label="📎"
            onClick={handleFileButtonClick}
            disabled={isUploading}
          />
 
          <input 
            name="message"
            type="text" 
            placeholder="Type a message..." 
            className='bg-(--primary-color-light) text-(--text-color) placeholder:text-(--text-muted) border border-(--border-color) w-full rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-(--secondary-color) transition-shadow duration-150' 
            value={newMessage}
            onChange={onTyping}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
            disabled={isUploading}
            autoComplete="off"
          />
 
          <Button
            onClick={handleSendMessage}
            type="primary"
            label={isUploading ? "Sending..." : "Send"}
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  )
}

export default MessagesPane