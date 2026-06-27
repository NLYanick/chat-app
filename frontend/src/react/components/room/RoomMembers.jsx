import { useRef, useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import MemberItem from "./MemberItem";
import FormInput from "../form/FormInput";
import { useAuth } from "../../AuthUserContext";
import { sendRequest } from "../../utils/requests";
import { useParams } from "react-router-dom";
import ContextMenu from "../ContextMenu";

function RoomMembers({ members, userIsOwner, owner }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteUsername, setInviteUsername] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  const { user } = useAuth();
  const { roomId } = useParams();

  const onInviteUser = async (username) => {
    if (!username) {
      setError("Please enter a username");
      return;
    }
    setError("");

    const { json } = await sendRequest(`/room-invites/rooms/${roomId}`, 'POST', { username, invited_by: user.uid });

    if (!json.success) {
      setError(json.error || "Failed to send invite");
      return;
    }

    setModalOpen(false);
  }

  const onClear = () => {
    setInviteUsername("");
    inputRef.current.value = "";
    setError("");
  }

  if (!members) return <p>Loading members...</p>;

  // TODO: remove member functionality
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-bold">Members</h2>

      {userIsOwner && (
        <>
          <Button type="primary" label="Invite User" onClick={() => setModalOpen(true)} />

          {modalOpen && (
            <Modal
              onClose={() => setModalOpen(false)}
              footer={<Button type="primary" label="Invite" onClick={() => onInviteUser(inviteUsername)} />}
            >
              <h3 className="text-xl font-bold mb-4">Invite User</h3>
              <p>Enter the username of the user you want to invite to this room.</p>

              <div className="flex gap-3 items-center">
                <FormInput label="Username" placeholder="Enter username" onChange={(e) => setInviteUsername(e.target.value)} ref={inputRef} />
                <Button type="secondary" label="Clear" onClick={() => onClear()} />
              </div>

              {error && <p className="text-red-500 mt-2">{error}</p>}
            </Modal>
          )}
        </>
      )}

      <ul className="space-y-4">
        {members.map(member => (
          <MemberItem key={member.uid} member={member} isOwner={member.uid === owner} />
        ))}
      </ul>
    </div>
  );
}

export default RoomMembers