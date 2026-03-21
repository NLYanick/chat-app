
function Button({ label, type = "primary", onClick = null }) {
    let typeStyling;

    switch(type) {
      case 'primary':
        typeStyling = 'bg-(--secondary-color)'
        break;
      case 'secondary':
        break;
    }

    return (
        <button className={`cursor-pointer px-4 py-2 rounded-lg shadow-lg ${typeStyling}`}
          onClick={onClick}
        >
          {label}
        </button>
    )
}

export default Button