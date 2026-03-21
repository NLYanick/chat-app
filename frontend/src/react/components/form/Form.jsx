
function Form({ children, formLabel = 'Form', backgroundColor = '#181818', onSubmit = {} }) {
  return (
    <>
      <form className="p-12 rounded-lg shadow-lg flex flex-col gap-8 w-96"
        style={{ backgroundColor: backgroundColor }}
        onSubmit={onSubmit}
      >
        <h1 className="text-3xl font-bold mb-4">{formLabel}</h1>
        
        <div className="flex flex-col gap-4">
          {children}
        </div>
  
        <button type="submit" className="bg-(--secondary-color) text-white p-2 rounded">
          Versturen
        </button>
      </form>
    </>
  );
}

export default Form