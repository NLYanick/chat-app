import { useEffect, useState } from "react";
import { useAuth } from "../AuthUserContext";
import { sendRequest } from "../utils/requests";
import InviteItem from "../components/InviteItem";

function Invites() {
  const [invites, setInvites] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
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

    fetchInvites();
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
    <div className="space-y-12 mb-4">
      <h1 className='text-4xl sm:text-5xl'>Invites</h1>
      <div className="w-full sm:max-w-lg bg-(--primary-color-light) p-4 sm:p-8 rounded-lg shadow-md flex flex-col gap-4">
        {invites.length === 0 ? (
          <p>No invites found.</p>
        ) : (
          <ul className="space-y-4">
            {invites.map(invite => (
              <InviteItem invite={invite} onAccept={handleAccept} onDecline={handleDecline} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Invites;