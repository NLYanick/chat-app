import { useState } from "react";

function MembersChoiceChipGrid({ members, selectedMember, onSelect, label }) {
  const [showingAmount, setShowingAmount] = useState(5);
  
  return (
    <div>
      <p className="mt-4 mb-2 font-semibold">{label}</p>
      
      <div className="flex justify-center gap-3 mt-4 flex-wrap border border-(--border-color) rounded-lg p-4 max-h-60 overflow-y-scroll app-scrollbar">
        {members.length === 0 ? <p className="text-(--text-muted)">No members available.</p> : 
          members.slice(0, showingAmount).map(member => (
            <div
              key={member.uid}
              onClick={() => onSelect(member.username)}
              className={`border-2 rounded-lg px-3 py-2 transition-all duration-150 hover:-translate-y-0.5 ${selectedMember === member.username ? 'border-(--error-color) bg-(--error-color)/10' : 'border-(--border-color) hover:border-(--secondary-color)'} cursor-pointer`}
            >
              <p key={`${member.uid}-p`}>{member.username}</p>
            </div>
          ))
        }
      </div>

      {showingAmount < members.length && (
        <button 
          className="mt-6 text-(--secondary-color) hover:underline cursor-pointer transition-colors"
          onClick={() => setShowingAmount(prev => prev + 5)}
        >
          Show more
        </button>
      )}
    </div>
  )
}

export default MembersChoiceChipGrid