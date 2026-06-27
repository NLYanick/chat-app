import { useEffect, useState } from "react";

export function useImagePreview(image) {
    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        if (!image) {
          setImagePreview(null);
          return;
        }
    
        const objectUrl = URL.createObjectURL(image);
        setImagePreview(objectUrl);
    
        return () => URL.revokeObjectURL(objectUrl); // Free memory whenever this component is unmounted
      }, [image]);

    return imagePreview;
}