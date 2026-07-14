function getSizeValue(size) {
  switch(size.toUpperCase()) {
    case 'SMALL':
      return { size: 'w-10 h-10', text: "" };
    case 'MEDIUM':
      return { size: 'w-20 h-20', text: "text-2xl" };
    case 'LARGE':
      return { size: 'w-30 h-30', text: "text-5xl" };
    default:
      return { size: 'w-10 h-10', text: "" };
  }
}

function RoomIcon({ roomName, roomImage, size = "SMALL" }) {
  if (typeof size !== 'string') size = "SMALL";

  const imageUrl = roomImage ? `${import.meta.env.VITE_BACKEND_URL}/public${roomImage}` : null;

  const sizeValue = getSizeValue(size);

  return (
    <>
      {imageUrl ? (
        <img 
          className={sizeValue.size + ' rounded-full object-cover shrink-0 ring-2 ring-(--border-color)'} 
          src={imageUrl} 
          alt={roomName} 
        /> 
      ) : (
        <div className={sizeValue.size + ' rounded-full bg-(--surface-2) flex items-center justify-center shrink-0 ring-2 ring-(--border-color)'}>
          <span className={sizeValue.text + ' text-(--text-color) font-bold font-display'}>
            {roomName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </>
  )
}

export default RoomIcon