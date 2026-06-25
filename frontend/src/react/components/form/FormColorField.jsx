import { useState } from "react";

function FormColorField({ label, onChange = () => {}, ...props }) {
  const [color, setColor] = useState(props.value || '#000000');

  const handleChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    
    onChange(newColor);
  }

  return (
    <div className="flex flex-col gap-1 mb-4 text-left">
      {label && <label className="text-sm font-semibold">{label}</label>}
      <input
        type="color"
        className="border-2 border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-(--secondary-color) outline-none h-12 w-full cursor-pointer"
        {...props}
        value={color}
        onChange={handleChange}
      />
      {<span className="text-sm"><em>{color.toUpperCase()}</em></span>}
    </div>
  );
}

export default FormColorField