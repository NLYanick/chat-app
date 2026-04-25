import { useState, useEffect } from 'react';
import { sendRequest } from '../utils/requests';
import { useAuth } from "../AuthUserContext";
import Rooms from './Rooms';

function Home() {
  const [error, setError] = useState(null);

  const { user } = useAuth();

  if(error) throw new Error(error.message); 

  return (
    <>
      <div className='flex flex-1'>
        <div className='w-1/4 p-4 border-r'>
          <Rooms />
        </div>
        
        <div className='w-3/4 p-4 grid grid-rows-[1fr_2fr]'>
          <div className='flex justify-center items-center'>
            <h1 className='text-5xl mb-4'>Welcome {user.username}!</h1>
          </div>

          <div className='p-4'>
            <p className='wrap-break-word'>{JSON.stringify(user) ?? 'NULL'}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home