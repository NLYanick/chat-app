import { useParams } from "react-router-dom";

function Room() {
  const { roomId } = useParams();

  // TODO: Edit button, Logo bar, messages
  return (
    <div>
      <p>Room {roomId}</p>
    </div>
  )
}

export default Room