function FormTextField({ label, subtext, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4 text-left">
      {label && <label className="text-sm font-semibold">{label}</label>}
      <textarea
        {...props}
        className="bg-(--primary-color) border-2 border-(--border-color) text-(--text-color) placeholder:text-(--text-muted) p-2.5 rounded-lg focus:ring-2 focus:ring-(--secondary-color) focus:border-(--secondary-color) outline-none transition-all duration-150 min-h-16"
      />
      {subtext && <span className="text-sm text-(--text-muted)"><em>{subtext}</em></span>}
    </div>
  );
}

export default FormTextField