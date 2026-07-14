import Button from "../Button";

function InviteItem({ invite, onAccept, onDecline }) {
  return (
    <li key={invite.uid} className="rounded-lg shadow-lg py-2 border-2 border-gray-300 flex items-center justify-between gap-4 px-4">
      <p className="flex-1">
        <strong>{invite.inviter_details.username}</strong> invited you to <strong>{invite.room_details ? invite.room_details.name : 'Unknown Room'}</strong>
      </p>
      <div className="flex gap-2">
        <Button type="success" label="Accept" onClick={() => onAccept(invite)} />
        <Button type="error" label="Decline" onClick={() => onDecline(invite)} />
      </div>
    </li>
  )
}

export default InviteItem