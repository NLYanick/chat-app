import { useState, useEffect } from "react";
import { useAuth } from "../AuthUserContext";

function Friends() {
  const [friends, setFriends] = useState([{ id: 1, name: "John Doe" }, { id: 2, name: "Jane Smith" }]); // Placeholder data

  const { user } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">Friends</h1>
      
      <ul className="">
        {friends.map(friend => (
          <li key={friend.id} className="mb-2">
            {friend.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Friends