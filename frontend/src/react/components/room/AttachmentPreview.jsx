import { useState } from "react";
import DownloadBubble from "../DownloadBubble";
import { handleDownload } from "../../utils/download";

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
        className="relative" 
        onMouseEnter={() => setShowDownload(true)} 
        onMouseLeave={() => setShowDownload(false)}
        onClick={onClick}
      >
        <img
          src={fullUrl}
          alt={filename}
          className={`${sizeClass} rounded-md object-cover`}
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
        <video src={fullUrl} controls className={`${sizeClass} rounded-md`} />
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
    
    await handleDownload(e, fullUrl, filename);

    setIsDownloading(false);
  }

  return (
    <button
      onClick={handleDownloadClick}
      className="cursor-pointer flex items-center gap-2 bg-gray-600 hover:bg-gray-500 transition-colors duration-200 py-2 px-3 rounded-md text-sm"
      title={error ? "Download failed — try again" : filename}
      disabled={isDownloading}
    >
      <span>📎</span>
      <span className="truncate max-w-40">{filename}</span>
      {size != null && (
        <span className="text-xs text-gray-300">{(size / 1024).toFixed(0)}KB</span>
      )}
    </button>
  );
}

export default AttachmentPreview;