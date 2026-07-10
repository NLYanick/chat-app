import { useState, useEffect } from "react";
import { useAuth } from "../AuthUserContext";
import { sendRequest } from "../../utils/requests";
import Button from "../components/Button";
import FriendItem from "../components/FriendItem";
import { emitEvent, subscribeToEvent } from "../../utils/socket-client";
import Modal from "../components/Modal";
import SinglePageLayout from "../layouts/SinglePageLayout";

function Friends() {
  const [friends, setFriends] = useState([]);
  
  const [addFriendName, setAddFriendName] = useState("");
  const [addFriendError, setAddFriendError] = useState(null);
  const [addFriendSuccess, setAddFriendSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

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

    const unsubscribe = subscribeToEvent('user_status_change', ({ userId, status }) => {
      setFriends(prev =>
        prev.map(f => f.uid === userId ? { ...f, status } : f)
      );
    });

    return () => {
      if (unsubscribe) unsubscribe();
    }
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

      emitEvent('notification', { user_id: json.friend_request.recipient, notification: `You have a new friend request from ${user.username}` });

      setAddFriendError(null);
      setAddFriendSuccess("Friend request sent successfully!");
      setAddFriendName("");
      setSelectedFriend(null);

      setTimeout(() => {
        setAddFriendSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Error adding friend:", error);
      setAddFriendError("Failed to add friend. Please try again.");
    }
  }

  const removeFriend = async (friendId) => {
    try {
      const { json } = await sendRequest(`/users/${user.uid}/friends/${friendId}`, "DELETE");

      if (!json.success) {
        console.error("Failed to remove friend:", json.error);
        return;
      }
      
      setFriends(friends.filter(friend => friend.uid !== friendId));
      setShowModal(false);
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };
  
  const onRemoveClick = (friendId) => {
    setShowModal(true);
    setSelectedFriend(friendId);
  }

  return (
    <SinglePageLayout title="Friends">
      
      <div className="flex gap-8">
        <div className="bg-(--primary-color-light) p-8 rounded-lg shadow-md w-md">
          <h2 className="text-2xl font-semibold mb-4">Your Friends</h2>
          
          {friends.length === 0 ? (
            <p>You have no friends yet. Add some!</p>
          ) : (
            <>
              <ul className="flex flex-col gap-4">
                {friends.map(friend => (
                  <FriendItem key={friend.uid} friend={friend} onRemove={onRemoveClick} />
                ))}
              </ul>

              {showModal && (
                <Modal 
                  onClose={() => setShowModal(false)}
                  footer={
                    <div className="flex justify-end gap-4">
                      <Button label="Close" type="secondary" onClick={() => setShowModal(false)} />
                      <Button label="Remove" type="error" onClick={() => removeFriend(selectedFriend)} />
                    </div>
                  }
                >
                  <h3 className="text-xl font-semibold mb-4">Removing Friend</h3>
                  <p>Are you sure you want to remove <strong>{friends.find(f => f.uid === selectedFriend)?.username}</strong> from your friends list?</p>
                </Modal>
              )}
            </>
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
    </SinglePageLayout>
  );
}

export default Friends