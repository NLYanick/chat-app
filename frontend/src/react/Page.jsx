import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function Page() {
  return (
    <div>
      <NavBar />
      <div className='min-h-screen flex flex-col items-center justify-center text-center'>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          
          <Route path='/profile' element={<Profile />}></Route>

          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>

          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default Page;