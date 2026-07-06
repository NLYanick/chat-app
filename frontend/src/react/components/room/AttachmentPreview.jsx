import { useState } from "react";
import DownloadBubble from "../DownloadBubble";
import { handleDownload } from "../../utils/download";

function AttachmentPreview({ attachment }) {
  const { url, filename, type, size } = attachment;

  const [showDownload, setShowDownload] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(false);

  const fullUrl = `${import.meta.env.VITE_BACKEND_URL}/public${url}`;

  if (type === 'image') {
    return (
      <div 
        className="relative" 
        onMouseEnter={() => setShowDownload(true)} 
        onMouseLeave={() => setShowDownload(false)}
      >
        <img
          src={fullUrl}
          alt={filename}
          className="max-w-60 max-h-60 rounded-md object-cover"
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
      >
        <video src={fullUrl} controls className="max-w-70 max-h-70 rounded-md" />
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
        <audio src={fullUrl} controls className="max-w-60" />
        {showDownload && <DownloadBubble filename={filename} fullUrl={fullUrl} />}
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