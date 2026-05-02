
const BUTTON_STYLES = {
    primary: 'bg-(--secondary-color)',
    secondary: 'bg-(--primary-color) border-2 border-white',
    secondary_light: 'bg-(--primary-color-light) border-2 border-white',
    success: 'bg-green-600 text-white',
    error: 'bg-red-700 text-white'
};

function Button({ label, type = "primary", onClick = null, buttonType = "submit", fullWidth = false, fullHeight = false, disabled = false }) {
    const typeStyling = BUTTON_STYLES[type] || BUTTON_STYLES.primary;

    return (
        <button className={`cursor-pointer px-4 py-2 rounded-lg shadow-lg min-w-16 ${typeStyling} ${fullWidth ? 'w-full' : ''} ${fullHeight ? 'h-full' : ''}`}
          onClick={onClick}
          type={buttonType}
          disabled={disabled}
        >
          {label}
        </button>
    )
}

export default Button