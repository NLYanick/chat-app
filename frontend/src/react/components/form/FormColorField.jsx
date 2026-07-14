function FormColorField({ label, value, onChange = () => {}, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4 text-left">
      {label && <label className="text-sm font-semibold">{label}</label>}
      <input
        type="color"
        className="border-2 border-(--border-color) p-2 rounded-lg focus:ring-2 focus:ring-(--secondary-color) outline-none h-12 w-full cursor-pointer transition-all duration-150 bg-(--primary-color)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      {<span className="text-sm text-(--text-muted)"><em>{value?.toUpperCase()}</em></span>}
    </div>
  );
}

export default FormColorField;