import { Link } from "react-router-dom";
import RoomIcon from "./RoomIcon";
import Tooltip from "../Tooltip";

function RoomItem({ room }) {
  return (
    <li>
      <Tooltip title={room.name} description={room.description}>
        <Link 
          to={`/rooms/${room.uid}`} 
          style={{ backgroundColor: room.color_hex }} 
          className="flex items-center space-x-5 px-6 w-full h-full rounded-lg shadow-lg py-3 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
        >
          <RoomIcon roomName={room.name} roomImage={room.image} />
          <p className="truncate w-3/4 text-left">{room.name}</p>
        </Link>
      </Tooltip>
    </li>
  );
}

export default RoomItem;