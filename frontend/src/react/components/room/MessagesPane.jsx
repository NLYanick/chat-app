import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../AuthUserContext";
import { emitEvent, subscribeToEvent } from "../../utils/socket-client";
import { sendRequest } from "../../utils/requests";
import Button from "../Button";
import MessageItem from "./MessageItem";
import FileUploadItem from "./FileUploadItem";
import Modal from "../Modal";
import AttachmentPreview from "./AttachmentPreview";

function MessagesPane({ room, members }) {
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [error, setError] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [editingMessageId, setEditingMessageId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  const { user } = useAuth();

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    let unsubscribeSend;
    let unsubscribeEdit;
    let unsubscribeDelete;

    setNewMessage("");
    setNewFiles([]);

    async function fetchMessages() {
      try {
        const { json } = await sendRequest(`/messages/rooms/${room?.uid}`, 'GET');
        if (!json.success) {
          setError("Could not load messages:", json.error);
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
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }

    fetchMessages();

    return () => {
      if (unsubscribeSend) unsubscribeSend()
      if (unsubscribeEdit) unsubscribeEdit()
      if (unsubscribeDelete) unsubscribeDelete()
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

  return (
    <div
      className='grid grid-rows-[1fr_auto] h-full relative'
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-(--secondary-color)/20 border-4 border-dashed border-(--secondary-color) rounded-md pointer-events-none">
          <p className="text-xl font-bold text-gray-700 bg-white/80 px-4 py-2 rounded-md">
            Drop files to attach
          </p>
        </div>
      )}
 
      <div className='flex flex-col gap-4 py-4 h-full overflow-y-scroll overflow-x-hidden app-scrollbar'>
        <h1 className='text-3xl sm:text-4xl font-bold my-6'>Welcome to {room?.name || 'the room'}</h1>
        
        {messages.length === 0 && (
          <p>No messages yet. Start the conversation!</p>
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
        {error && <p className='text-red-500'>{error}</p>}
 
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
            <p className="text-sm text-gray-300 italic truncate w-full">"{selectedMessage?.text}"</p>
          </Modal>
        )}

        {selectedAttachment && (
          <div className='fixed inset-0 bg-[#000000AA] flex justify-center items-center' onClick={() => setSelectedAttachment(null)}>
            <AttachmentPreview attachment={selectedAttachment} previewSize="large" />
          </div>
        )}
      </div>
 
      <div className="p-4 flex flex-col gap-2">
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
            className='bg-gray-300 text-gray-700 placeholder:text-gray-500 border border-gray-400 w-full rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-(--secondary-color)' 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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