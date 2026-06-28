import { useRef, useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import MemberItem from "./MemberItem";
import FormInput from "../form/FormInput";
import { useAuth } from "../../AuthUserContext";
import { sendRequest } from "../../utils/requests";
import { useParams } from "react-router-dom";
import MembersChoiceChipGrid from "./MembersChoiceChipGrid";

function RoomMembers({ members, userIsOwner, owner }) {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [removeUserModalOpen, setRemoveUserModalOpen] = useState(false);
  
  const [inviteUsername, setInviteUsername] = useState("");
  const [removeUsername, setRemoveUsername] = useState("");

  const [error, setError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  const inviteInputRef = useRef(null);
  const removeUserInputRef = useRef(null);

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

    setInviteSuccess("Invite sent successfully!");
  }

  const onRemoveUser = async (username) => {
    if (!username) {
      setError("Please enter a username");
      return;
    }
    setError("");

    const userToRemove = members.find(member => member.username === username);
    if (!userToRemove) {
      setError("User not found in this room");
      return;
    }

    const { json } = await sendRequest(`/rooms/${roomId}/members/${userToRemove.uid}`, 'DELETE', { removed_by: user.uid });

    if (!json.success) {
      setError(json.error || "Failed to remove user");
      return;
    }

    setRemoveUsername("");
    setRemoveUserModalOpen(false);
  }

  const onInviteClose = () => {
    setInviteModalOpen(false);
    setInviteUsername("");
    inviteInputRef.current.value = "";
    setError("");
    setInviteSuccess("");
  }

  const onClear = (ref) => {
    if (ref === inviteInputRef) {
      setInviteUsername("");
    } else if (ref === removeUserInputRef) {
      setRemoveUsername("");
    }
    ref.current.value = "";
    setError("");
  }

  const handleRemovingUserClick = (username) => {
    if(username === removeUsername) {
      setRemoveUsername("");
      removeUserInputRef.current.value = "";
      return;
    }

    setRemoveUsername(username);
    removeUserInputRef.current.value = username;
  }

  const onRemoveUserClose = () => {
    setRemoveUserModalOpen(false);
    setRemoveUsername("");
    removeUserInputRef.current.value = "";
    setError("");
  }

  if (!members) return <p>Loading members...</p>;

  const filteredMembers = members.filter(member => member.uid !== user.uid && member.uid !== owner);

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-bold">Members</h2>

      {userIsOwner && (
        <div className="flex flex-col gap-4">
          <Button type="primary" label="Invite User" onClick={() => setInviteModalOpen(true)} />

          {inviteModalOpen && (
            <Modal
              onClose={onInviteClose}
              footer={
                <div className="flex gap-3">
                  <Button type="secondary" label="Cancel" onClick={onInviteClose} />
                  <Button type="primary" label="Invite" onClick={() => onInviteUser(inviteUsername)} />
                </div>
              }
            >
              <h3 className="text-xl font-bold mb-4">Invite User</h3>
              <p>Enter the username of the user you want to invite to this room.</p>

              <div className="flex gap-3 items-center">
                <FormInput label="Username" placeholder="Enter username" onChange={(e) => setInviteUsername(e.target.value)} ref={inviteInputRef} />
                <Button type="secondary" label="Clear" onClick={() => onClear(inviteInputRef)} />
              </div>

              {error && <p className="text-red-500 mt-2">{error}</p>}
              {inviteSuccess && <p className="text-green-500 mt-2">{inviteSuccess}</p>}
            </Modal>
          )}

          <Button type="error" label="Remove Member" onClick={() => setRemoveUserModalOpen(true)} />

          {removeUserModalOpen && (
            <Modal
              onClose={onRemoveUserClose}
              footer={<Button type="error" label="Remove" onClick={() => onRemoveUser(removeUsername)} />}
            >
              <h3 className="text-xl font-bold mb-4">Remove Member</h3>
              <p>Enter the username of the user you want to remove from this room.</p>

              <div className="flex gap-3 items-center">
                <FormInput label="Username" placeholder="Enter username" onChange={(e) => setRemoveUsername(e.target.value)} ref={removeUserInputRef} />
                <Button type="secondary" label="Clear" onClick={() => onClear(removeUserInputRef)} />
              </div>

              <MembersChoiceChipGrid 
                members={filteredMembers} 
                selectedMember={removeUsername} 
                onSelect={handleRemovingUserClick} 
                label="Click on a member to select them for removal:"
              />

              {error && <p className="text-red-500 mt-2">{error}</p>}
            </Modal>
          )}
        </div>
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