function FileUploadItem({ file, onRemove, index }) {
  return (
    <div className="flex items-center gap-2 bg-gray-200 text-gray-700 text-sm rounded-md px-3 py-1">
      <span className="truncate max-w-40">{file.name || file.filename}</span>
      <span className="text-gray-500 text-xs">
        {(file.size / 1024).toFixed(0)}KB
      </span>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-gray-500 hover:text-red-500 font-bold leading-none cursor-pointer"
        aria-label={`Remove ${file.name || file.filename}`}
      >
        ×
      </button>
    </div>
  )
}

export default FileUploadItem;