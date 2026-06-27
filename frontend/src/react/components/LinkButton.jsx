import { Link } from "react-router-dom";
import { BUTTON_STYLES } from "../../enums/button-styles";

function LinkButton({ label, to, type = "primary", onClick = null, fullWidth = false, fullHeight = false }) {
  const typeStyling = BUTTON_STYLES[type] || BUTTON_STYLES.primary;

  return (
    <Link
      to={to}
      className={`cursor-pointer px-4 py-2 rounded-lg shadow-lg min-w-16 ${typeStyling} ${fullWidth ? 'w-full' : ''} ${fullHeight ? 'h-full' : ''}`}
      onClick={onClick}
    >
      {label}
    </Link>
  )
}

export default LinkButton