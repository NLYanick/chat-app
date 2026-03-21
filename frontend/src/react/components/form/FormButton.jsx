
function FormButton({ label = 'Submit' }) {
  return (
    <button type="submit" className="bg-(--secondary-color) text-white py-2 px-4 rounded-lg cursor-pointer">
      {label}
    </button>
  );
}

export default FormButton