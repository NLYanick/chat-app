function UserErrorsBox({ userErrors }) {
  return (
    <div className="flex flex-col gap-1 mb-4 text-left p-4 rounded-lg border-2 border-(--error-color) bg-(--error-color)/10 animate-pop-in">
      <p className="text-(--error-color)"><strong>Errors:</strong></p>
      <ul>
        {userErrors.map(ue => 
          <li className="text-(--error-color) list-disc list-inside" key={ue}>{ue}</li>
        )}
      </ul>
    </div>
  );
}

export default UserErrorsBox