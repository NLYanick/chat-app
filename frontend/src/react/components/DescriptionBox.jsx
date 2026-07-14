function DescriptionBox({ description, borderColorHex }) {
  return (
    <div className={`w-full min-h-32 border-2 rounded-xl p-4 shadow-lg bg-(--primary-color-light)/60`} style={{ borderColor: borderColorHex }}>
      {description ? (
        <p className="text-left text-sm wrap-break-word text-(--text-color)">{description}</p>
      ) : (
        <p className="text-left text-sm text-(--text-muted) italic">No description yet.</p>
      )}
    </div>
  )
}

export default DescriptionBox