
function UserErrorsBox({ userErrors }) {
  return (
    <div className="flex flex-col gap-1 mb-4 text-left p-4 rounded-lg border-2 border-red-600 bg-red-200">
      <p className="text-red-500"><strong>Errors:</strong></p>
      <ul>
        {userErrors.map(ue => 
          <li className="text-red-500 list-disc list-inside" key={ue}>{ue}</li>
        )}
      </ul>
    </div>
  );
}

export default UserErrorsBox