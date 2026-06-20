import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { sendRequest } from "../../utils/requests";
import Button from "../../components/Button";
import RoomItem from "../../components/room/RoomItem";
import { useAuth } from "../../AuthUserContext";

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

        <Link to="/rooms/create" className="w-full block">
          <Button label="Create Room" fullWidth={true} />
        </Link>
      </div>
    )
}

export default RoomsList