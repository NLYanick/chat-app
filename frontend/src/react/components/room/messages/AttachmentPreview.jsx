import { useState } from "react";
import DownloadBubble from "../../DownloadBubble";
import { handleDownload } from "../../../../utils/download";

const AttachmentSize = {
  small: "max-w-60 max-h-60",
  medium: "max-w-100 max-h-100",
  large: "max-w-150 max-h-150",
}

function AttachmentPreview({ attachment, onClick, previewSize = "small" }) {
  const { url, filename, type, size } = attachment;

  const [showDownload, setShowDownload] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(false);

  const fullUrl = `${import.meta.env.VITE_BACKEND_URL}/public${url}`;
  const sizeClass = AttachmentSize[previewSize] || AttachmentSize.small;

  if (type === 'image') {
    return (
      <div 
        className="relative overflow-hidden rounded-md transition-transform duration-200 hover:scale-[1.02]" 
        onMouseEnter={() => setShowDownload(true)} 
        onMouseLeave={() => setShowDownload(false)}
        onClick={onClick}
      >
        <img
          src={fullUrl}
          alt={filename}
          className={`${sizeClass} rounded-md object-cover cursor-pointer`}
        />
        {showDownload && <DownloadBubble filename={filename} fullUrl={fullUrl} />}
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div 
        className="relative" 
        onMouseEnter={() => setShowDownload(true)} 
        onMouseLeave={() => setShowDownload(false)}
        onClick={onClick}
      >
        <video src={fullUrl} controls className={`${sizeClass} rounded-md shadow-md`} />
        {showDownload && <DownloadBubble filename={filename} fullUrl={fullUrl} />}
      </div>
    );
  }

  if (type === 'audio') {
    return (
      <div 
        className="relative" 
        onMouseEnter={() => setShowDownload(true)} 
        onMouseLeave={() => setShowDownload(false)}
      >
        <audio src={fullUrl} controls className={`${AttachmentSize.medium}`} />
      </div>
    );
  }

  const handleDownloadClick = async (e) => {
    e.stopPropagation();
    setIsDownloading(true);
    setError(false);
    
    const success = await handleDownload(e, fullUrl, filename);
    setError(!success);

    setIsDownloading(false);
  }

  return (
    <button
      onClick={handleDownloadClick}
      className={`cursor-pointer flex items-center gap-2 bg-(--surface-2) hover:bg-(--border-color) transition-all duration-200 py-2 px-3 rounded-lg text-sm ${error ? 'ring-2 ring-(--error-color)' : ''}`}
      title={error ? "Download failed — try again" : filename}
      disabled={isDownloading}
    >
      <span className={isDownloading ? 'animate-bounce' : ''}>📎</span>
      <span className="truncate max-w-40">{filename}</span>
      {size != null && (
        <span className="text-xs text-(--text-muted)">{(size / 1024).toFixed(0)}KB</span>
      )}
    </button>
  );
}

export default AttachmentPreview;