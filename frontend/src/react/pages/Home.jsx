import { useState, useEffect } from 'react';
import { sendRequest } from '../utils/requests';
import { useAuth } from "../AuthUserContext";

function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [data, setData] = useState(null);

  const { user, logout } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const { json } = await sendRequest('/rooms');
        setData(json.message);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if(loading) return (<p className='font-bold'>Loading...</p>); 
  if(error) throw new Error(error.message); 

  return (
    <>
      <div className='flex flex-col gap-12'>
        <h1 className='mb-4'>Hi</h1>
        <p>{data ?? 'NULL'}</p>
        <p>{JSON.stringify(user) ?? 'NULL'}</p>
      </div>
    </>
  );
}

export default Home