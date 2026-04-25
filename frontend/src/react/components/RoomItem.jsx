function RoomItem({ room }) {
    return (
        <li className="rounded-lg shadow-lg py-3 bg-(--primary-color-light) cursor-pointer">{room.room_name}</li>
    )
}

export default RoomItem