import { useState, Children } from "react";

function DropDownMenu({ buttonContent, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const items = Children.toArray(children);

  return (
    <div className="relative inline-block text-left h-10 z-9999">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer rounded-full transition-transform duration-150 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--secondary-color)"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {buttonContent}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>

          <ul
            onClick={() => setIsOpen(false)}
            className="absolute right-0 top-8 mt-2 w-48 text-(--text-color) bg-(--primary-color-light) border border-(--border-color) rounded-xl shadow-2xl z-20 overflow-hidden cursor-pointer animate-pop-in origin-top-right"
          >
            {items.map((child, index) => (
              <div key={index}>
                {child}
                {index !== items.length - 1 && (
                  <hr className="border-(--border-color)"/>
                )}
              </div>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default DropDownMenu