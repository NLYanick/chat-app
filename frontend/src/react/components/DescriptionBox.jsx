function DescriptionBox({ description, borderColorHex }) {
  return (
    <div className={`w-full min-h-32 border-2 rounded-lg p-3 shadow-lg`} style={{ borderColor: borderColorHex }}>
      <p className="text-left text-sm wrap-break-word">{description}</p>
    </div>
  )
}

export default DescriptionBox