import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../AuthUserContext";
import { emitEvent, subscribeToEvent } from "../../utils/socket-client";
import { sendRequest } from "../../utils/requests";
import Button from "../Button";
import MessageItem from "./MessageItem";

function MessagesPane({ room, members }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  
  const { user } = useAuth();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    let unsubscribe;

    async function fetchMessages() {
      try {
        const { json } = await sendRequest(`/messages/rooms/${room?.uid}`, 'GET');
        if (!json.success) {
          setError("Could not load messages:", json.error);
          return;
        }

        setMessages(json.messages);
        
        unsubscribe = subscribeToEvent('message_sent', ({ message, roomId }) => {
          if (roomId === room?.uid) {
            setMessages(prev => {
              const exists = prev.some(m => m.uid === message.uid);
              if (exists) return prev; 
              return [...prev, message];
            });
          }
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }

    fetchMessages();

    return () => { if (unsubscribe) unsubscribe() };
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

      emitEvent('send_message', { message: json.data, roomId: room?.uid });

      setMessages(prev => [...prev, json.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className='grid grid-rows-[1fr_60px] h-full'>
      <div className='flex flex-col gap-4 py-4 h-full overflow-y-scroll overflow-x-hidden app-scrollbar'>
        <h1 className='text-3xl sm:text-4xl font-bold my-6'>Welcome to {room?.name || 'the room'}</h1>
        
        {error && <p className='text-red-500'>{error}</p>}
        {messages.length === 0 ? (
          <p>No messages yet. Start the conversation!</p>
        ) : (
          messages.map((message) => (
            <MessageItem key={message.uid} message={message} member={members?.find(m => m.uid === message.sender)} />
          ))
        )}

        <div ref={messagesEndRef} />
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