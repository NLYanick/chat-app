import Button from "../Button";

function FriendRequestItem({ request, onAccept, onDecline }) {
  return (
    <li key={request.uid} className="rounded-lg shadow-lg py-2 border-2 border-gray-300 flex items-center justify-between gap-4 px-4">
      <p className="flex-1">
        <strong>{request.sender_details.username}</strong> wants to be friends with you!
      </p>
      <div className="flex gap-2">
        <Button type="success" label="Accept" onClick={() => onAccept(request)} />
        <Button type="error" label="Decline" onClick={() => onDecline(request)} />
      </div>
    </li>
  )
}

export default FriendRequestItem