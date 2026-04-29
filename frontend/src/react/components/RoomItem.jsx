function RoomItem({ room }) {
  const imageUrl = room.image ? `${import.meta.env.VITE_BACKEND_URL}/public${room.image}` : null;

  return (
    <li 
      className='rounded-lg shadow-lg py-3 cursor-pointer'
      style={{ backgroundColor: room.color_hex }}
    >
      <div className="flex items-center justify-between px-6">
        {imageUrl ? (
          <img className="w-10 h-10 rounded-full object-cover" src={imageUrl} alt={room.name} /> 
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 font-bold">{room.name.charAt(0)}</span>
          </div>
        )}
        <p>{room.name}</p>
      </div>
    </li>
  )
}

export default RoomItem