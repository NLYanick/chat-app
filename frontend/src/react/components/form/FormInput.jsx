
function FormInput({ label, subtext, ...props }) {
  return (
    <div className="flex flex-col gap-1 mb-4 text-left">
      {label && <label className="text-sm font-semibold">{label}</label>}
      <input
        {...props}
        className="border-2 border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-(--secondary-color) outline-none"
      />
      {subtext && <span className="text-sm"><em>{subtext}</em></span>}
    </div>
  );
}

export default FormInput