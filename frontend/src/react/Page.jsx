import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProtectedRoute from './ProtectedRoute';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import CreateRoom from './pages/rooms/CreateRoom';
import Room from './pages/rooms/Room';
import EditRoom from './pages/rooms/EditRoom';
import Notifications from './pages/Notifications';
import Friends from './pages/Friends';
import { sendRequest } from './utils/requests'
import { useAuth } from './AuthUserContext';
import { useEffect } from 'react';
import { useState } from 'react';

function Page() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    async function refreshToken() {
      try {
        const { json } = await sendRequest('/authenticate/refresh', 'POST');

        if (json.success && json.user && json.accessToken) {
          login(json.user, json.accessToken);
          navigate("/");
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    refreshToken();
  }, []);

  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className='min-h-screen flex flex-col items-center justify-center text-center pt-15'>
        <Routes>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/reset-password' element={<ResetPassword />}></Route>
          <Route path='/forgot-password' element={<ForgotPassword />}></Route>

          <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
          <Route path='/profile'>
            <Route path='me' index element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>
            <Route path=':userId' index element={<ProtectedRoute><UserProfile /></ProtectedRoute>}></Route>
          </Route>
          <Route path='/notifications' element={<ProtectedRoute><Notifications /></ProtectedRoute>}></Route>
          <Route path='/friends' element={<ProtectedRoute><Friends /></ProtectedRoute>}></Route>

          <Route path='/rooms'>
            <Route index element={<Navigate to="/" replace />} />

            <Route path='create' element={<ProtectedRoute><CreateRoom /></ProtectedRoute>}></Route>
            <Route path=':roomId' element={<ProtectedRoute><Room /></ProtectedRoute>}></Route>
            <Route path=':roomId/edit' element={<ProtectedRoute><EditRoom /></ProtectedRoute>}></Route>
          </Route>

          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default Page;