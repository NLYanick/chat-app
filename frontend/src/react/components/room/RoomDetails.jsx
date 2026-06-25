import Button from "../Button";
import DescriptionBox from "../DescriptionBox";
import RoomIcon from "./RoomIcon";

function RoomDetails({ room, userIsOwner }) {
  if (!room) return <p>No room details available.</p>;

  // TODO Edit and delete buttons
  return (
    <div className="p-4 flex flex-col items-center text-center gap-6">
      <h2 className="text-2xl font-bold block w-full wrap-break-word">{room.name}</h2>
      
      <RoomIcon roomName={room.name} roomImage={room.image} size="LARGE" />
      
      <DescriptionBox description={room.description} borderColorHex={room.color_hex} />

      {userIsOwner && (
        <div className="w-full flex gap-6 justify-center">
          <Button type="edit" label="Edit"></Button>
          <Button type="error" label="Delete"></Button>
        </div>
      )}
    </div>
  )
}

export default RoomDetails