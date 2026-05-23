import { Link } from "react-router-dom"
import RoomIcon from "./RoomIcon"

function RoomItem({ room }) {
  return (
    <li 
      className='rounded-lg shadow-lg py-3 cursor-pointer'
      style={{ backgroundColor: room.color_hex }}
    >
      <Link to={`/rooms/${room.uid}`} className="flex items-center justify-between px-6">
        <RoomIcon roomName={room.name} roomImage={room.image} />
        <p>{room.name}</p>
      </Link>
    </li>
  )
}

export default RoomItem