import { Link } from "react-router-dom"
import RoomIcon from "./RoomIcon"
import { useState } from "react";

function RoomItem({ room }) {
  const [visible, setVisible] = useState(false); 
  
  return (
    <li 
      className='rounded-lg shadow-lg py-3 cursor-pointer relative'
      style={{ backgroundColor: room.color_hex }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <Link to={`/rooms/${room.uid}`} className="flex items-center space-x-5 px-6">
        <RoomIcon roomName={room.name} roomImage={room.image} />
        <p className="truncate w-3/4 text-left">{room.name}</p>
      </Link>

      {visible && (
        <div className="absolute bottom-full mb-2.5 wrap-break-word bg-(--primary-color-light) rounded-md p-3 pointer-events-none max-w-40 w-40">
          <div className="space-y-2">
            <p>{room.name}</p>
            <p className="text-sm text-gray-500 truncate">{room.description}</p>
          </div>
        </div>
      )}
    </li>
  )
}

export default RoomItem