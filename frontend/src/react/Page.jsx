import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProtectedRoute from './ProtectedRoute';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import CreateRoom from './pages/rooms/CreateRoom';
import Room from './pages/rooms/Room';

function Page() {
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
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>

          <Route path='/rooms'>
            <Route path='create' element={<ProtectedRoute><CreateRoom /></ProtectedRoute>}></Route>
            <Route path=':roomId' element={<ProtectedRoute><Room /></ProtectedRoute>}></Route>
          </Route>

          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default Page;