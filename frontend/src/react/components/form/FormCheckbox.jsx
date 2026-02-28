import { useState } from "react";

function FormCheckBox({ label, onChange, ...props }) {
  const [checked, setChecked] = useState(false);

  return (
    <label className="flex items-center cursor-pointer gap-2">
      <div className={`
        w-8 h-8 border-2 rounded-lg flex items-center justify-center transition-colors
        ${checked ? 'bg-(--secondary-color) border-(--secondary-color)' : 'border-slate-300'}
      `}
      onClick={() => onChange(!checked)}>
        {checked && (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
        
      </div>

      <input 
        type="checkbox" 
        className="hidden" 
        onChange={() => setChecked(!checked)} 
      />
      
      <span>{label}</span>
    </label>
  );
}

export default FormCheckBox