function MessageToolsBubble({ onEdit, onDelete }) {
  return (
    <div className="absolute top-0 left-0 pl-2 pt-2">
      <div className="flex gap-2 justify-end flex-row-reverse items-start h-fit w-fit border border-gray-600 rounded-md p-1 bg-(--primary-color-light)">
        <button 
          className="text-sm text-gray-400 hover:text-gray-200 cursor-pointer"
          onClick={onEdit}
        >
          Edit
        </button>
        <button 
          className="text-sm text-red-400 hover:text-red-200 cursor-pointer border-r border-gray-400 pr-2"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default MessageToolsBubble;