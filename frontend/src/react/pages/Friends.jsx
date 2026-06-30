import { useState, useEffect } from "react";
import { useAuth } from "../AuthUserContext";
import { sendRequest } from "../utils/requests";
import Button from "../components/Button";
import FriendItem from "../components/FriendItem";

function Friends() {
  const [friends, setFriends] = useState([]);
  
  const [addFriendName, setAddFriendName] = useState("");
  const [addFriendError, setAddFriendError] = useState(null);
  const [addFriendSuccess, setAddFriendSuccess] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { json } = await sendRequest(`/users/${user.uid}/friends`, 'GET');
        
        if (!json.success) {
          console.error("Failed to fetch friends:", json.error);
          return;
        }
        
        setFriends(json.friends || []);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [user.uid]);

  const addFriend = async (e) => {
    e.preventDefault();

    if (!addFriendName.trim()) return; 
    
    try {
      const { json } = await sendRequest(`/friend-requests`, "POST", { sender_id: user.uid, recipient_name: addFriendName });

      if (!json.success) {
        setAddFriendError(json.error || "Failed to add friend. Please try again.");
        return;
      }

      setAddFriendError(null);
      setAddFriendSuccess("Friend request sent successfully!");
      setAddFriendName("");

      setTimeout(() => {
        setAddFriendSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Error adding friend:", error);
      setAddFriendError("Failed to add friend. Please try again.");
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl sm:text-5xl font-bold mb-10">Friends</h1>
      
      <div className="flex gap-8">
        <div className="bg-(--primary-color-light) p-8 rounded-lg shadow-md w-md">
          <h2 className="text-2xl font-semibold mb-4">Your Friends</h2>
          
          {friends.length === 0 ? (
            <p>You have no friends yet. Add some!</p>
          ) : (
            <ul className="">
              {friends.map(friend => (
                <FriendItem key={friend.uid} friend={friend} />
            ))}
          </ul>
          )}
        </div>

        <div className="bg-(--primary-color-light) p-8 rounded-lg shadow-md w-md h-fit">
          <form className="flex flex-col gap-4" onSubmit={addFriend}>
            <h2 className="text-2xl font-semibold mb-3">Add a Friend</h2>
            
            <input
              type="text"
              placeholder="Friend's Name"
              className="p-2 border rounded"
              value={addFriendName}
              onChange={(e) => setAddFriendName(e.target.value)}
            />
            {addFriendError && <p className="text-red-500">{addFriendError}</p>}
            {addFriendSuccess && <p className="text-green-500">{addFriendSuccess}</p>}

            <Button label="Add Friend" type="primary" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Friends