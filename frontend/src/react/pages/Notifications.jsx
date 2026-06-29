import { useEffect, useState } from "react";
import { useAuth } from "../AuthUserContext";
import { sendRequest } from "../utils/requests";
import InviteItem from "../components/InviteItem";
import Button from "../components/Button";

function Notifications() {
  const [invites, setInvites] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const { user } = useAuth();

  const fetchInvites = async () => {
    try {
      const { json } = await sendRequest(`/room-invites/user/${user.uid}`, 'GET');

      if (!json.success) {
        console.error("Failed to fetch invites:", json.error);
        return;
      }

      setInvites(json.data);
    } catch (err) {
      console.error("Error fetching invites:", err);
    }
  };

  const fetchFriendRequests = async () => {
    // TODO
  }

  useEffect(() => {
    fetchInvites();
    fetchFriendRequests();

    setTimeout(() => {
      fetchInvites();
      fetchFriendRequests();
    }, 10_000);

    return () => {
      clearTimeout();
    }
  }, [user.uid]);

  const handleAccept = async (inviteId) => {
    try {
      const { json } = await sendRequest(`/room-invites/${inviteId}/accept`, 'POST', { userUid: user.uid });
      
      if (!json.success) {
        console.error("Failed to accept invite:", json.error);
        return;
      }
      
      setInvites(prev => prev.filter(invite => invite.uid !== inviteId));
    } catch (err) {
      console.error("Error accepting invite:", err);
    }
  };

  const handleDecline = async (inviteId) => {
    try {
      const { json } = await sendRequest(`/room-invites/${inviteId}/decline`, 'POST', { userUid: user.uid });
      
      if (!json.success) {
        console.error("Failed to decline invite:", json.error);
        return;
      }

      setInvites(prev => prev.filter(invite => invite.uid !== inviteId));
    } catch (err) {
      console.error("Error declining invite:", err);
    }
  };

  return (
    <div className="space-y-12 mb-4 w-full">
      <h1 className='text-4xl sm:text-5xl'>Notifications</h1>
      
      <div className="sm:flex sm:justify-center sm:items-start sm:gap-8 w-full">
        <div className="w-full sm:max-w-lg bg-(--primary-color-light) p-4 sm:p-8 rounded-lg shadow-md flex flex-col gap-8">
          <h2 className="text-2xl sm:text-3xl mb-1">Room Invites</h2>
          
          {invites.length === 0 ? (
            <p>No invites found.</p>
          ) : (
            <ul className="space-y-4">
              {invites.map(invite => (
                <InviteItem invite={invite} onAccept={handleAccept} onDecline={handleDecline} />
              ))}
            </ul>
          )}

          <Button type="primary" label="Refresh" onClick={fetchInvites} />
        </div>

        <div className="w-full sm:max-w-lg bg-(--primary-color-light) p-4 sm:p-8 rounded-lg shadow-md flex flex-col gap-8">
          <h2 className="text-2xl sm:text-3xl mb-1">Friend Requests</h2>
          
          {friendRequests.length === 0 ? (
            <p>No friend requests found.</p>
          ) : (
            <ul className="space-y-4">
              {friendRequests.map(request => (
                <p>TODO</p>
              ))}
            </ul>
          )}

          <Button type="primary" label="Refresh" onClick={fetchFriendRequests} />
        </div>
      </div>
    </div>
  )
}

export default Notifications;