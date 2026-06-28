import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sendRequest } from "../../utils/requests";
import RoomsList from "./RoomsList";
import RoomDetails from "../../components/room/RoomDetails";
import RoomMembers from "../../components/room/RoomMembers";
import { useAuth } from "../../AuthUserContext";
import { subscribeToEvent } from "../../utils/socket-client";
import MessagesPane from "../../components/room/MessagesPane";

function Room() {
  const { roomId } = useParams();

  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState(null);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const userIsOwner = user?.uid === room?.owner;

  useEffect(() => {
    let unsubscribe;

    async function fetchRoom() {
      try {
        const { json } = await sendRequest(`/rooms/${roomId}`, 'GET');

        if (!json.success) {
          setError(json.error || "Failed to fetch room");
          return;
        }

        setRoom(json.room);
        setMembers(json.members);

        unsubscribe = subscribeToEvent('user_status_change', ({ userId, status }) => {
          setMembers(prev =>
            prev.map(m => m.uid === userId ? { ...m, status } : m)
          );
        });
      } catch (err) {
        setError(err.message || "An error occurred while fetching the room");
      }
    }

    fetchRoom();

    return () => { if (unsubscribe) unsubscribe() };
  }, [roomId]);

  if(error) throw new Error(error);

  return (
    <div className='w-full flex sm:flex-1 sm:flex-row flex-col-reverse'>
      <div className='sm:w-1/6 p-2 sm:border-r'>
        <RoomsList />
      </div>
      
      <div className='sm:w-4/6 p-4 sm:grid sm:grid-rows-[1fr_2fr]'>
        <MessagesPane room={room} />
      </div>

      <div className='sm:w-1/6 p-2 sm:border-l h-[calc(100vh-60px)] overflow-y-scroll app-scrollbar'>
        <div className='border-b hidden sm:block'>
          <RoomDetails room={room} userIsOwner={userIsOwner} />
        </div>
        <div className='p-4 hidden sm:block'>
          <RoomMembers members={members} userIsOwner={userIsOwner} owner={room?.owner} />
        </div>
      </div>
    </div>
  )
}

export default Room