import { useEffect } from "react";

function Modal({ onClose = () => {}, footer, children }) {

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className='fixed inset-0 bg-[#000000AA] flex justify-center items-center z-50 animate-fade-in'
      onClick={onClose}
    >
      <div
        className='relative w-80 sm:w-120 min-h-32 sm:min-h-48 bg-(--primary-color-light) border border-(--border-color) rounded-xl shadow-2xl p-4 sm:p-6 animate-pop-in'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex flex-col items-center justify-center gap-4 h-full min-h-full'>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className='cursor-pointer absolute right-0 top-0 size-10 hover:bg-(--surface-2) rounded-md transition-colors duration-150'
          >
            <span className='leading-none text-(--secondary-color) text-4xl'>&times;</span>
          </button>

          {children}

          {footer && <div className='flex justify-center mt-4'>{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export default Modal