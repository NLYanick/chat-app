import { useState } from "react";

function MembersChoiceChipGrid({ members, selectedMember, onSelect, label }) {
  const [showingAmount, setShowingAmount] = useState(5);
  
  return (
    <div>
      <p className="mt-4 mb-2 font-semibold">{label}</p>
      
      <div className="flex justify-center gap-4 mt-4 flex-wrap border rounded-md p-4 max-h-60 overflow-y-scroll app-scrollbar">
        {members.length === 0 ? <p className="text-gray-500">No members available.</p> : 
          members.slice(0, showingAmount).map(member => (
            <div
              key={member.uid}
              onClick={() => onSelect(member.username)}
              className={`border-2 rounded-lg p-2 ${selectedMember === member.username ? 'border-red-500' : 'border-gray-300'} cursor-pointer`}
            >
              <p key={`${member.uid}-p`}>{member.username}</p>
            </div>
          ))
        }
      </div>

      {showingAmount < members.length && (

        <button 
          className="mt-6 text-blue-500 hover:underline cursor-pointer"
          onClick={() => setShowingAmount(prev => prev + 5)}
        >
          Show more
        </button>
      )}
    </div>
  )
}

export default MembersChoiceChipGrid