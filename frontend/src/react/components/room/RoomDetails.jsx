import { Link } from "react-router-dom";
import Button from "../Button";
import DescriptionBox from "../DescriptionBox";
import RoomIcon from "./RoomIcon";
import LinkButton from "../LinkButton";

function RoomDetails({ room, userIsOwner }) {
  if (!room) return <p>No room details available.</p>;

  return (
    <div className="p-4 flex flex-col items-center text-center gap-6">
      <h2 className="text-2xl font-bold block w-full wrap-break-word">{room.name}</h2>
      
      <RoomIcon roomName={room.name} roomImage={room.image} size="LARGE" />
      
      <DescriptionBox description={room.description} borderColorHex={room.color_hex} />

      {userIsOwner && (
        <LinkButton type="edit" label="Edit" to={`/rooms/${room.uid}/edit`} fullWidth />
      )}
    </div>
  )
}

export default RoomDetails