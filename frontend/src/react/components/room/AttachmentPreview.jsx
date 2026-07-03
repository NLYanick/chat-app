function AttachmentPreview({ attachment }) {
  const { url, filename, type, size } = attachment;
 
  const fullUrl = `${import.meta.env.VITE_BACKEND_URL}/public${url}`;

  if (type === 'image') {
    return (
      // <>
      <img
        src={fullUrl}
        alt={filename}
        className="max-w-60 max-h-60 rounded-md object-cover"
      />
      //   <a
      //     href={fullUrl}
      //     target="_blank"
      //     rel="noopener noreferrer" 
      //     download={filename} 
      //     className="cursor-pointer w-8 h-8 absolute top-0 right-0 bg-(--primary-color-light) bg-opacity-50 text-white text-xs m-1 rounded-md flex items-center"
      //   >
      //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-6 h-6 m-auto fill-white">
      //       <path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z"/>
      //     </svg>  
      //   </a>
      // </>
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