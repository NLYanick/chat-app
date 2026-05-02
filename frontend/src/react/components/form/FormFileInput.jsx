
function FormFileInput({ label, name, subtext, color = "bg-(--primary-color)", ...props }) {
  return (
    <div className="flex flex-col gap-1 mb-4 text-left">
      <label htmlFor={name} className="cursor-pointer">
        <input 
          type="file" 
          name={name} 
          id={name} 
          className='absolute opacity-0 size-0'
          {...props} 
        />

        <span className={`${color} border-2 border-white p-2 rounded-md block w-64 text-center`}>{label}</span>
      </label>
      {subtext && <span className="text-sm"><em>{subtext}</em></span>}
    </div>
  );
}

export default FormFileInput