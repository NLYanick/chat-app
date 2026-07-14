function FormFileInput({ label, name, subtext, color = "bg-(--primary-color)", ...props }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4 text-left">
      <label htmlFor={name} className="cursor-pointer">
        <input 
          type="file" 
          name={name} 
          id={name} 
          className='absolute opacity-0 size-0'
          {...props} 
        />

        <span className={`${color} border-2 border-(--border-color) hover:border-(--secondary-color) text-(--text-color) p-2.5 rounded-lg block w-64 text-center transition-all duration-150 hover:-translate-y-0.5`}>{label}</span>
      </label>
      {subtext && <span className="text-sm text-(--text-muted)"><em>{subtext}</em></span>}
    </div>
  );
}

export default FormFileInput