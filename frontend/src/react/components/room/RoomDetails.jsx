import { Link, useNavigate } from "react-router-dom";
import Button from "../Button";
import DescriptionBox from "../DescriptionBox";
import RoomIcon from "./RoomIcon";
import LinkButton from "../LinkButton";
import { useState } from "react";
import Modal from "../Modal";
import { useAuth } from "../../AuthUserContext";
import { sendRequest } from "../../../utils/requests";
import { emitEvent } from "../../../utils/socket-client";

function RoomDetails({ room, userIsOwner }) {
  const [modalOpen, setModalOpen] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const onLeaveRoom = async () => {
    const { json } = await sendRequest(`/rooms/${room.uid}/members/leave`, 'DELETE', { user_id: user.uid });
    
    if (!json.success) {
      console.error("Failed to leave room:", json.error);
      alert("Failed to leave room");
      return;
    }

    setModalOpen(false);

    emitEvent('left_room', { room_id: room.uid, user_id: user.uid });

    navigate('/rooms');
  }

  const onRestoreRoom = async () => {
    const { json } = await sendRequest(`/rooms/${room.uid}/restore`, 'PATCH', { sender: user.uid });

    if (!json.success) {
      console.error("Failed to restore room:", json.error);
      return;
    }
    navigate('/rooms');
  }

  if (!room) return <p className="text-(--text-muted)">No room details available.</p>;

  return (
    <div className="p-4 flex flex-col items-center text-center gap-6 animate-rise-in">
      <h2 className="text-2xl font-bold block w-full wrap-break-word">{room.name}</h2>
      
      <div className="relative">
        <RoomIcon roomName={room.name} roomImage={room.image} size="LARGE" />
        {room.inactive && (
          <span className="absolute -bottom-1 -right-1 text-[10px] font-semibold uppercase tracking-wide bg-(--warning-color) text-(--primary-color) px-2 py-0.5 rounded-full shadow">Inactive</span>
        )}
      </div>
      
      <DescriptionBox description={room.description} borderColorHex={room.color_hex} />

      {userIsOwner ? (room.inactive ? 
        <Button type="success" label="Restore Room" fullWidth onClick={onRestoreRoom} /> : 
        <LinkButton type="edit" label="Edit" to={`/rooms/${room.uid}/edit`} fullWidth />
      ) : (
        <Button type="error" label="Leave Room" fullWidth onClick={() => setModalOpen(true)} />
      )}

      {modalOpen && (
        <Modal
          onClose={() => setModalOpen(false)}
          footer={
            <div className="flex justify-center gap-4">
              <Button type="secondary" label="Cancel" onClick={() => setModalOpen(false)} />
              <Button type="error" label="Leave Room" onClick={onLeaveRoom} />
            </div>
          }
        >
          <h3 className="text-xl font-bold mb-4">Leaving Room</h3>
          <p>Are you sure you want to leave <strong>{room.name}</strong>?</p>
        </Modal>
      )}
    </div>
  )
}

export default RoomDetails