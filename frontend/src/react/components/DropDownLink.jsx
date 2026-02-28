import { Link } from "react-router-dom";

function DropDownLink({ label, to = '', action = '', type = 'normal' }) {
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
      className={`p-2 pl-4 w-full text-left ${typeStyling}`}
    >  
      <Link to={to}>{label}</Link>
    </li>
  )
}

export default DropDownLink