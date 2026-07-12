import { useEffect, useState } from "react";
import { useAuth } from "../AuthUserContext";
import { sendRequest } from "../../utils/requests";
import InviteItem from "../components/invites/InviteItem";
import Button from "../components/Button";
import FriendRequestItem from "../components/invites/FriendRequestItem";
import SinglePageLayout from "../layouts/SinglePageLayout";
import { emitEvent } from "../../utils/socket-client";

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
    try {
      const { json } = await sendRequest(`/friend-requests/user/${user.uid}`, 'GET');

      if (!json.success) {
        console.error("Failed to fetch friend requests:", json.error);
        return;
      }

      setFriendRequests(json.friend_requests);
    } catch (err) {
      console.error("Error fetching friend requests:", err);
    }
  };

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

  const handleAcceptRoomInvite = async (inviteId) => {
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

  const handleDeclineRoomInvite = async (inviteId) => {
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

  const handleAcceptFriendRequest = async (request) => {
    try {
      const { json } = await sendRequest(`/friend-requests/${request.uid}/accept`, 'POST');

      if (!json.success) {
        console.error("Failed to accept friend request:", json.error);
        return;
      }

      setFriendRequests(prev => prev.filter(request => request.uid !== request.uid));

      emitEvent('add_friend', { user_id: request.sender, my_id: user.uid });
    } catch (err) {
      console.error("Error accepting friend request:", err);
    }
  };

  const handleDeclineFriendRequest = async (request) => {
    try {
      const { json } = await sendRequest(`/friend-requests/${request.uid}/decline`, 'POST');

      if (!json.success) {
        console.error("Failed to decline friend request:", json.error);
        return;
      }
      setFriendRequests(prev => prev.filter(request => request.uid !== request.uid));
    } catch (err) {
      console.error("Error declining friend request:", err);
    }
  };

  return (
    <SinglePageLayout title="Notifications">
      <div className="sm:flex sm:justify-center sm:items-start sm:gap-8 w-full">
        <div className="w-md bg-(--primary-color-light) p-4 sm:p-8 rounded-lg shadow-md flex flex-col gap-8">
          <h2 className="text-2xl sm:text-3xl mb-1">Room Invites</h2>
          
          {invites.length === 0 ? (
            <p>No invites found.</p>
          ) : (
            <ul className="space-y-4">
              {invites.map(invite => (
                <InviteItem invite={invite} onAccept={handleAcceptRoomInvite} onDecline={handleDeclineRoomInvite} />
              ))}
            </ul>
          )}

          <Button type="primary" label="Refresh" onClick={fetchInvites} />
        </div>

        <div className="w-md sm:max-w-lg bg-(--primary-color-light) p-4 sm:p-8 rounded-lg shadow-md flex flex-col gap-8">
          <h2 className="text-2xl sm:text-3xl mb-1">Friend Requests</h2>
          
          {friendRequests.length === 0 ? (
            <p>No friend requests found.</p>
          ) : (
            <ul className="space-y-4">
              {friendRequests.map(request => (
                <FriendRequestItem request={request} onAccept={handleAcceptFriendRequest} onDecline={handleDeclineFriendRequest} />
              ))}
            </ul>
          )}

          <Button type="primary" label="Refresh" onClick={fetchFriendRequests} />
        </div>
      </div>
    </SinglePageLayout>
  )
}

export default Notifications;