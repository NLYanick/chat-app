import { BUTTON_STYLES } from "../../enums/button-styles";

function Button({ label, type = "primary", onClick = null, buttonType = "submit", fullWidth = false, fullHeight = false, disabled = false }) {
  const typeStyling = BUTTON_STYLES[type] || BUTTON_STYLES.primary;

  return (
    <button
      className={`
        cursor-pointer px-4 py-2 rounded-lg shadow-lg min-w-16 font-medium transition-all duration-150 ease-out hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--secondary-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--primary-color) disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0 disabled:hover:shadow-lg 
        ${typeStyling} ${fullWidth ? 'w-full' : ''} ${fullHeight ? 'h-full' : ''}
      `}
      onClick={onClick}
      type={buttonType}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default Button