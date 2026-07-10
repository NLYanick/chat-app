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
        className={`w-8 h-8 border-2 rounded-lg flex items-center justify-center 
          ${checked ? 'bg-(--secondary-color) border-(--secondary-color)' : 'border-slate-300'}
          peer-focus-visible:ring-2 peer-focus-visible:ring-(--secondary-color) peer-focus-visible:ring-offset-2`}
      >
        {checked && (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <span>{label}</span>
    </label>
  );
}

export default FormCheckBox;