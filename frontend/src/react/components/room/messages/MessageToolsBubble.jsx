function MessageToolsBubble({ onEdit, onDelete }) {
  return (
    <div className="absolute top-0 left-0 pl-2 pt-2 animate-pop-in z-10">
      <div className="flex gap-2 justify-end flex-row-reverse items-start h-fit w-fit border border-(--border-color) rounded-lg p-1 bg-(--primary-color-light) shadow-lg">
        <button 
          className="text-sm text-(--text-muted) hover:text-(--text-color) cursor-pointer px-1.5 py-0.5 rounded transition-colors duration-150 hover:bg-(--surface-2)"
          onClick={onEdit}
        >
          Edit
        </button>
        <button 
          className="text-sm text-(--error-color) hover:brightness-125 cursor-pointer px-1.5 py-0.5 rounded border-r border-(--border-color) pr-2 transition-colors duration-150 hover:bg-(--surface-2)"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default MessageToolsBubble;