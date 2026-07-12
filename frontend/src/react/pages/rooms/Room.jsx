import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sendRequest } from "../../../utils/requests";
import RoomsList from "./RoomsList";
import RoomDetails from "../../components/room/RoomDetails";
import RoomMembers from "../../components/room/RoomMembers";
import { useAuth } from "../../AuthUserContext";
import { subscribeToEvent } from "../../../utils/socket-client";
import MessagesPane from "../../components/room/messages/MessagesPane";
import Modal from "../../components/Modal";
import LinkButton from "../../components/LinkButton";

function Room() {
  const { roomId } = useParams();

  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState(null);
  const [error, setError] = useState("");

  const [removedModalOpen, setRemovedModalOpen] = useState(false);

  const { user } = useAuth();
  const userIsOwner = user?.uid === room?.owner;

  useEffect(() => {
    async function fetchRoom() {
      try {
        const { json } = await sendRequest(`/rooms/${roomId}`, 'GET');

        if (!json.success) {
          setError(json.error || "Failed to fetch room");
          return;
        }

        setRoom(json.room);
        setMembers(json.members);
      } catch (err) {
        setError(err.message || "An error occurred while fetching the room");
      }
    }

    const unsubscribeUserStatus = subscribeToEvent('user_status_change', ({ userId, status }) => {
      setMembers(prev =>
        prev.map(m => m.uid === userId ? { ...m, status } : m)
      );
    });
    const unsubscribeUpdate = subscribeToEvent('room_updated', ({ room }) => {
      setRoom(room);
    });

    const unsubscribeMemberJoined = subscribeToEvent('user_joined', async ({ room, user }) => {
      if (room.uid === roomId) {
        setMembers(prev => [...prev, user]);
      }
    });
    const unsubscribeMemberLeft = subscribeToEvent('user_left', ({ room_id, user_id }) => {
      if (room_id === roomId && user_id !== user.uid) {
        setMembers(prev => prev.filter(m => m.uid !== user_id));
      }
      if (user_id === user.uid) {
        setRemovedModalOpen(true);
      }
    });

    fetchRoom();

    return () => { 
      if (unsubscribeUserStatus) unsubscribeUserStatus(); 
      if (unsubscribeMemberJoined) unsubscribeMemberJoined();
      if (unsubscribeMemberLeft) unsubscribeMemberLeft();
    };
  }, [roomId]);

  if(error) throw new Error(error);

  return (
    <div className='w-full flex sm:flex-1 sm:flex-row flex-col-reverse'>
      <div className='sm:w-1/6 p-2 sm:border-r'>
        <RoomsList />
      </div>
      
      <div className='sm:w-4/6 p-4 h-[calc(100vh-60px)]'>
        <MessagesPane room={room} members={members} />
      </div>

      <div className='sm:w-1/6 p-2 sm:border-l h-[calc(100vh-60px)] overflow-y-scroll app-scrollbar'>
        <div className='border-b hidden sm:block'>
          <RoomDetails room={room} userIsOwner={userIsOwner} />
        </div>
        <div className='p-4 hidden sm:block'>
          <RoomMembers members={members} userIsOwner={userIsOwner} owner={room?.owner} isInactive={room?.inactive} />
          
          {removedModalOpen && (
            <Modal
              footer={<LinkButton type="primary" label="Back to Home" to="/" />}
            >
              <h3 className="text-xl font-bold mb-4">Removed From Room</h3>
              <p>You have been removed from this room.</p>
            </Modal>
          )}
        </div>
      </div>
    </div>
  )
}

export default Room