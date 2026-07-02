function AttachmentPreview({ attachment }) {
  const { url, filename, type, size } = attachment;
 
  const fullUrl = `${import.meta.env.VITE_BACKEND_URL}/public${url}`;

  if (type === 'image') {
    return (
      <img
        src={fullUrl}
        alt={filename}
        className="max-w-60 max-h-60 rounded-md object-cover"
      />
    );
  }
 
  if (type === 'video') {
    return (
      <video src={fullUrl} controls className="max-w-70 max-h-70 rounded-md" />
    );
  }
 
  if (type === 'audio') {
    return <audio src={fullUrl} controls className="max-w-60" />;
  }
 
  return (
    <a
      href={fullUrl}
      target="_blank"
      rel="noopener noreferrer"
      download={filename}
      className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 transition-colors duration-200 py-2 px-3 rounded-md text-sm"
    >
      <span>📎</span>
      <span className="truncate max-w-40">{filename}</span>
      {size != null && (
        <span className="text-xs text-gray-300">{(size / 1024).toFixed(0)}KB</span>
      )}
    </a>
  );
}

export default AttachmentPreview;