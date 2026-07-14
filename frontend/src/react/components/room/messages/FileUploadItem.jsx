function FileUploadItem({ file, onRemove, index }) {
  return (
    <div className="flex items-center gap-2 bg-(--surface-2) text-(--text-color) text-sm rounded-lg px-3 py-1.5 animate-pop-in">
      <span className="truncate max-w-40">{file.name || file.filename}</span>
      <span className="text-(--text-muted) text-xs font-mono">
        {(file.size / 1024).toFixed(0)}KB
      </span>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-(--text-muted) hover:text-(--error-color) font-bold leading-none cursor-pointer transition-transform duration-150 hover:scale-125"
        aria-label={`Remove ${file.name || file.filename}`}
      >
        ×
      </button>
    </div>
  )
}

export default FileUploadItem;