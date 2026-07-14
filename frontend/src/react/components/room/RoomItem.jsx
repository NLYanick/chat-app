import { Link } from "react-router-dom";
import RoomIcon from "./RoomIcon";
import Tooltip from "../Tooltip";

function RoomItem({ room }) {
  const tooltipContent = (
    <div className="space-y-2 text-center">
      <p className="font-bold text-sm">{room.name}</p>
      <p className="font-bold text-sm">{room.inactive && <span className="text-xs text-gray-300">(Inactive)</span>}</p>
      <p className="text-xs text-gray-400 truncate">{room.description}</p>
    </div>
  );

  return (
    <li>
      <Tooltip content={tooltipContent}>
        <Link 
          to={`/rooms/${room.uid}`} 
          style={{ '--room-accent': room.color_hex, opacity: room.inactive ? 0.5 : 1 }} 
          className="group flex items-center gap-4 px-4 w-full h-full rounded-xl shadow-md py-2.5 cursor-pointer border border-(--border-color) bg-(--primary-color-light) transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:border-[var(--room-accent)]"
        >
          <div className="w-1.5 self-stretch rounded-full shrink-0" style={{ backgroundColor: room.color_hex }} />
          <RoomIcon roomName={room.name} roomImage={room.image} />
          <p className="truncate flex-1 text-left font-medium">{room.name}</p>
        </Link>
      </Tooltip>
    </li>
  );
}

export default RoomItem;