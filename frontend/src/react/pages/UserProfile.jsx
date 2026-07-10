import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sendRequest } from '../../utils/requests';
import { useAuth } from "../AuthUserContext";
import Button from "../components/Button";
import ProfileIcon from "../components/profile/ProfileIcon";
import ProfileDetails from '../components/profile/ProfileDetails';
import Modal from '../components/Modal';
import { emitEvent } from '../../utils/socket-client';

function UserProfile() {
  const [error, setError] = useState(null);
  const [friendRequestError, setFriendRequestError] = useState(null);

  const [userShowing, setUserShowing] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [requestSend, setRequestSend] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();

  if (user && userId === user.uid) {
    navigate("/profile/me");
  }

  const isFriend = user && userShowing && userShowing.friends.includes(user.uid);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { json } = await sendRequest(`/users/${userId}`, 'GET');

        if (!json.success) {
          setError(json.error);
          return;
        } else if (json.user.disabled) {
          navigate("/");
          return;
        }

        setUserShowing(json.user);
      } catch (err) {
        setError(err);
      }
    }

    fetchUser();
  }, []);

  if (error) throw new Error(error);

  const addFriend = async (username) => {
    try {
      const { json, status } = await sendRequest(`/friend-requests`, "POST", { sender_id: user.uid, recipient_name: username });

      if (!json.success) {
        setFriendRequestError(json.error || "Failed to add friend. Please try again.");
        return;
      }

      emitEvent('notification', { user_id: json.friend_request.recipient, notification: `You have a new friend request from ${user.username}` });

      setShowModal(false);
      setRequestSend(true);
      setFriendRequestError(null);
    } catch (error) {
      console.error("Error adding friend:", error);
      setError("Failed to add friend. Please try again.");
    }
  }

  const removeFriend = async (friendId) => {
    try {
      const { json } = await sendRequest(`/users/${user.uid}/friends/${friendId}`, "DELETE");

      if (!json.success) {
        setFriendRequestError("Failed to remove friend: " + json.error);
        return;
      }

      setShowModal(false);

      window.location.reload();
    } catch (error) {
      console.error("Error removing friend:", error);
      setError("Failed to remove friend. Please try again.");
    }
  };

  return (
    <>
      <div className='flex flex-col gap-8 pb-8 min-w-96'>
        <h1 className='text-4xl font-semibold mt-16 sm:mt-8 mb-4'>Profile</h1>

        <div className='bg-(--primary-color-light) rounded-lg shadow-lg p-6 text-left flex flex-col gap-8'>
          <h2 className='text-2xl text-center font-semibold'>{userShowing?.username}</h2>

          <div className='flex justify-center'>
            <ProfileIcon imgSrc={userShowing?.avatar_url} size={userShowing?.avatar_url ? 'large' : 'medium'} />
          </div>
        </div>

        <ProfileDetails user={userShowing} />

        <div className='bg-(--primary-color-light) rounded-lg shadow-lg p-6 text-left flex flex-col gap-8'>
          <h2 className='text-2xl text-center font-semibold'>{isFriend ? 'Remove' : 'Add'} Friend</h2>

          {isFriend ? (
            <>
              <div className='flex justify-center'>
                <Button label="Remove Friend" type="error" onClick={() => setShowModal(true)} />
              </div>

              {showModal && (
                <Modal
                  onClose={() => setShowModal(false)}
                  footer={
                    <div className="flex gap-8">
                      <Button label="Remove" type="error" onClick={() => removeFriend(userShowing?.uid)} />
                      <Button label="Cancel" type="secondary" onClick={() => setShowModal(false)} />
                    </div>
                  }
                >
                  <h3 className="text-xl font-bold mb-2">Confirm Removal</h3>
                  <p className="text-center">Are you sure you want to remove this user from your friends list?</p>
                </Modal>
              )}
            </>
          ) : (
            requestSend ? (
              <p className='text-center text-green-500'>Friend request sent!</p>
            ) : (
              <>
                <div className='flex justify-center'>
                  <Button label="Add Friend" type="primary" onClick={() => addFriend(userShowing?.username)} />
                </div>

                {friendRequestError && <p className='text-center text-red-500'>{friendRequestError}</p>}
              </>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default UserProfile