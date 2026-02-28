import { useState } from "react";

function DropDownMenu({ buttonContent, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left h-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {buttonContent}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>

          {/* TODO Remove text-black */}
          <ul className="absolute right-0 top-8 mt-2 w-48 text-black bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden cursor-pointer">
            {children.map(child => (
              <>
                {child}
                {child !== children[children.length - 1] && (
                  <hr className="border-slate-400"/>
                )}
              </>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default DropDownMenu