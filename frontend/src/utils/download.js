export async function handleDownload (e, fullUrl, filename) {
  e.preventDefault();

  try {
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error("Network response was not ok");

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);

    return true;
  } catch (err) {
    console.error("Download failed:", err);
    return false;
  }
};