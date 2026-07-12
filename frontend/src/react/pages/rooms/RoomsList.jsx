import { useState, useEffect } from "react";
import { sendRequest } from "../../../utils/requests";
import Button from "../../components/Button";
import RoomItem from "../../components/room/RoomItem";
import { useAuth } from "../../AuthUserContext";
import LinkButton from "../../components/LinkButton";
import { subscribeToEvent } from "../../../utils/socket-client";

function RoomsList() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [rooms, setRooms] = useState([]);

    const { user } = useAuth();

    useEffect(() => {
      const fetchRooms = async () => {
        try {
          setLoading(true);

          const { json, status } = await sendRequest(`/rooms?user_id=${user?.uid}`, 'GET');
  
          if(!json.success) {
            console.error('Failed to fetch rooms:', json.message);
            return;
          }
  
          setRooms(json.rooms);
          setError(null);
        } catch (err) {
          setError(err);
          return;
        } finally {
          setLoading(false);
        }
      };

      fetchRooms();

      const unsubscribeUpdated = subscribeToEvent('room_updated', ({ room }) => {
        setRooms(prev => prev.map(r => r.uid === room.uid ? room : r));
      });
      const unsubscribeDeleted = subscribeToEvent('room_left', ({ room_id }) => {
        setRooms(prev => prev.filter(r => r.uid !== room_id));
      });

      return () => {
        if (unsubscribeUpdated) unsubscribeUpdated();
        if (unsubscribeDeleted) unsubscribeDeleted();
      }
    }, []);

    if(loading) return (<p className='font-bold'>Loading...</p>); 
    if(error) throw new Error(error.message); 
    
    return (
      <div className="p-4 h-full flex flex-col gap-8">
        <h1 className='text-2xl font-bold'>Rooms</h1>
        
        {rooms.length > 0 ? (
          <ul className="space-y-4 border-y p-4 overflow-y-scroll app-scrollbar h-[70vh] w-full">
            {rooms.map((room) => (
              <RoomItem key={room.uid} room={room} />
            ))}
          </ul>
        ) : (
          <em>No rooms available</em>
        )}

        <LinkButton to="/rooms/create" className="w-full block" label="Create Room" fullWidth={true} />
      </div>
    )
}

export default RoomsList