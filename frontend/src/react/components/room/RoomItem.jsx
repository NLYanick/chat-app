import { Link } from "react-router-dom";
import RoomIcon from "./RoomIcon";
import Tooltip from "../Tooltip";

function RoomItem({ room }) {
  const tooltipContent = (
    <div className="space-y-2 text-center">
      <p className="font-bold text-sm">{room.name}</p>
      <p className="text-xs text-gray-400 truncate">{room.description}</p>
    </div>
  );

  return (
    <li>
      <Tooltip content={tooltipContent}>
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