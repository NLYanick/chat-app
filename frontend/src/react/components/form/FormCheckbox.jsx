import { useState } from "react";

function FormCheckBox({ label, onChange, ...props }) {
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    const nextState = !checked;
    setChecked(nextState);
    if (onChange) onChange(nextState);
  };

  return (
    <label className="flex items-center cursor-pointer gap-2 group select-none">
      <input 
        type="checkbox" 
        className="sr-only peer"
        checked={checked}
        onChange={handleToggle} 
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleToggle();
          }
        }}
        {...props}
      />
      
      <div 
        className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all duration-150 ease-out
          ${checked ? 'bg-(--secondary-color) border-(--secondary-color) scale-105' : 'border-(--border-color) group-hover:border-(--secondary-color)'}
          peer-focus-visible:ring-2 peer-focus-visible:ring-(--secondary-color) peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-(--primary-color)`}
      >
        {checked && (
          <svg className="w-4 h-4 text-white animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <span>{label}</span>
    </label>
  );
}

export default FormCheckBox;