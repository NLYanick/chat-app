import { useState, useEffect } from 'react';
import { sendRequest } from '../utils/requests';
import { useAuth } from "../AuthUserContext";
import RoomsList from './rooms/RoomsList';

function Home() {
  const [error, setError] = useState(null);

  const { user } = useAuth();

  if(error) throw new Error(error.message); 

  return (
    <>
      <div className='w-full flex sm:flex-1 sm:flex-row flex-col-reverse'>
        <div className='sm:w-1/4 p-2 sm:border-r border-t-2 sm:border-t-0 border-t-(--secondary-color)'>
          <RoomsList />
        </div>
        
        <div className='sm:w-3/4 p-4 sm:grid sm:grid-rows-[1fr_2fr]'>
          <div className='flex justify-center items-center'>
            <h1 className='sm:text-5xl text-3xl my-4 sm:mb-4'>Welcome {user.username}!</h1>
          </div>

          <div className='p-4 hidden sm:block'>
            <p className='wrap-break-word'>{JSON.stringify(user) ?? 'NULL'}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home