import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sendRequest } from '../utils/requests';
import { useAuth } from "../AuthUserContext";
import Button from "../components/Button";
import ProfileIcon from "../components/profile/ProfileIcon";
import ProfileDetails from '../components/profile/ProfileDetails';

function UserProfile() {
  const [error, setError] = useState(null);

  const [userShowing, setUserShowing] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();

  if (user && userId === user.uid) {
    navigate("/profile/me");
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        const { json } = await sendRequest(`/users/${userId}`, 'GET');

        if(!json.success) {
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

  if (error) throw new Error(error.message);

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
      </div>
    </>
  );
}

export default UserProfile