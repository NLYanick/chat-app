import { Link } from "react-router-dom";

function DropDownLink({ label, to = '', action = null, type = 'normal' }) {
  let typeStyling = "text-(--text-color)"

  switch (type.toLowerCase()) {
    case "normal":
      break;
    case "error":
      typeStyling = "text-(--error-color)"
      break;
  }

  return (
    <li
      className={`w-full text-left ${typeStyling}`}
    >
      <Link 
        to={to} 
        onClick={action} 
        className="size-full block p-2.5 pl-4 transition-colors duration-150 hover:bg-(--surface-2)"
      >
        {label}
      </Link>
    </li>
  )
}

export default DropDownLink