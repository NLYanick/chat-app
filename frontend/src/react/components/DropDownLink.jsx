import { Link } from "react-router-dom";

function DropDownLink({ label, to = '', action = null, type = 'normal' }) {
  let typeStyling = ""

  switch (type.toLowerCase()) {
    case "normal":
      break;
    case "error":
      typeStyling = "text-red-500"
      break;
  }

  return (
    <li 
      className={`w-full text-left ${typeStyling}`}
    >  
      <Link to={to} onClick={action} className="size-full block p-2 pl-4">{label}</Link>
    </li>
  )
}

export default DropDownLink