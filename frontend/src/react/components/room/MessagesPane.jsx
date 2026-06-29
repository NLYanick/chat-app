import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../AuthUserContext";
import { emitEvent, subscribeToEvent } from "../../utils/socket-client";
import { sendRequest } from "../../utils/requests";
import Button from "../Button";
import MessageItem from "./MessageItem";
import Modal from "../Modal";

function MessagesPane({ room, members }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const { user } = useAuth();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    let unsubscribeSend;
    let unsubscribeEdit;
    let unsubscribeDelete;

    async function fetchMessages() {
      try {
        const { json } = await sendRequest(`/messages/rooms/${room?.uid}`, 'GET');
        if (!json.success) {
          setError("Could not load messages:", json.error);
          return;
        }

        setMessages(json.messages);
        
        unsubscribeSend = subscribeToEvent('message_sent', ({ message, room_id }) => {
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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { json } = await sendRequest(`/messages/rooms/${room?.uid}`, 'POST', {
        text: newMessage.trim(),
        sender: user.uid,
      });

      if (!json.success) {
        setError("Failed to send message:", json.error);
        return;
      }

      emitEvent('send_message', { message: json.data, room_id: room?.uid });

      setMessages(prev => [...prev, json.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
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
    <div className='grid grid-rows-[1fr_60px] h-full'>
      <div className='flex flex-col gap-4 py-4 h-full overflow-y-scroll overflow-x-hidden app-scrollbar'>
        <h1 className='text-3xl sm:text-4xl font-bold my-6'>Welcome to {room?.name || 'the room'}</h1>
        
        {error && <p className='text-red-500'>{error}</p>}
        {messages.length === 0 ? (
          <p>No messages yet. Start the conversation!</p>
        ) : (
          messages.map((message) => (
            <MessageItem 
              key={message.uid} 
              message={message} 
              member={members?.find(m => m.uid === message.sender)} 
              onOpenModal={onOpenModal}
            />
          ))
        )}

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
      </div>
      <div className="p-4 flex gap-2 items-center">
        <input 
          name="message"
          type="text" 
          placeholder="Type a message..." 
          className='bg-gray-300 text-gray-700 placeholder:text-gray-500 border border-gray-400 w-full rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-(--secondary-color)' 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
        />

        <Button onClick={handleSendMessage} type="primary" label="Send" />
      </div>
    </div>
  )
}

export default MessagesPane