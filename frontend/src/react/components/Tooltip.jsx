import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function Tooltip({ children, content, backgroundColor = "bg-(--surface-2)", textColor = "text-(--text-color)" }) {
  const [visible, setVisible] = useState(false);
  
  const triggerRef = useRef(null);
  const [absolutePos, setAbsolutePos] = useState({ top: 0, left: 0 });

  const updateCoordinates = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      
      setAbsolutePos({
        top: rect.top + window.scrollY - 10,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
  };

  const handleMouseEnter = () => {
    updateCoordinates();
    setVisible(true);
  };

  useEffect(() => {
    if (visible) {
      window.addEventListener("resize", updateCoordinates);
      return () => window.removeEventListener("resize", updateCoordinates);
    }
  }, [visible]);

  return (
    <>
      <div
        ref={triggerRef}
        className="w-full h-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>

      {visible &&
        createPortal(
          <div
            className={`fixed wrap-break-word ${backgroundColor} ${textColor} rounded-md p-3 shadow-xl border border-(--border-color) pointer-events-none max-w-40 w-40 z-9999 -translate-x-1/2 -translate-y-full animate-pop-in`}
            style={{
              top: `${absolutePos.top}px`,
              left: `${absolutePos.left}px`,
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}

export default Tooltip;