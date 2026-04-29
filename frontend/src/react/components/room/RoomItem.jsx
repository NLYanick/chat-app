import RoomIcon from "./RoomIcon"

function RoomItem({ room }) {
  return (
    <li 
      className='rounded-lg shadow-lg py-3 cursor-pointer'
      style={{ backgroundColor: room.color_hex }}
    >
      <div className="flex items-center justify-between px-6">
        <RoomIcon room={room} />
        <p>{room.name}</p>
      </div>
    </li>
  )
}

export default RoomItem