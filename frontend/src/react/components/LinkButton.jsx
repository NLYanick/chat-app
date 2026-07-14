import { Link } from "react-router-dom";
import { BUTTON_STYLES } from "../../enums/button-styles";

function LinkButton({ label, to, type = "primary", onClick = null, fullWidth = false, fullHeight = false }) {
  const typeStyling = BUTTON_STYLES[type] || BUTTON_STYLES.primary;

  return (
    <Link
      to={to}
      className={`
        inline-block text-center cursor-pointer px-4 py-2 rounded-lg shadow-lg min-w-16 font-medium transition-all duration-150 ease-out hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--secondary-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--primary-color) 
        ${typeStyling} ${fullWidth ? 'w-full' : ''} ${fullHeight ? 'h-full' : ''}
      `}
      onClick={onClick}
    >
      {label}
    </Link>
  )
}

export default LinkButton