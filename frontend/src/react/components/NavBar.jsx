import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthUserContext";
import { sendRequest } from '../utils/requests';
import ProfileIcon from "./profile/ProfileIcon"
import DropDownMenu from "./DropDownMenu";
import DropDownLink from "./DropDownLink";

const noBarRoutes = ['/login', '/register'];

function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { json } = await sendRequest('/authenticate/logout', 'POST', { username: user.username });

    if(json.success) {
      logout();
      navigate("/");
    } else {
      throw new Error("Could not logout.");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 w-full fixed border-b-2 h-15 bg-(--primary-color)" style={noBarRoutes.includes(location.pathname) ? { display: "none" } : {}}>
      <div>
        <Link to='/'>Homepage</Link>
      </div>
      
      {user ? (
        <div className="flex items-center gap-4 mr-2">
          <Link to="/invites" className="hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-8 h-8 fill-white">
              <path d="M125.4 128C91.5 128 64 155.5 64 189.4C64 190.3 64 191.1 64.1 192L64 192L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 192L575.9 192C575.9 191.1 576 190.3 576 189.4C576 155.5 548.5 128 514.6 128L125.4 128zM528 256.3L528 448C528 456.8 520.8 464 512 464L128 464C119.2 464 112 456.8 112 448L112 256.3L266.8 373.7C298.2 397.6 341.7 397.6 373.2 373.7L528 256.3zM112 189.4C112 182 118 176 125.4 176L514.6 176C522 176 528 182 528 189.4C528 193.6 526 197.6 522.7 200.1L344.2 335.5C329.9 346.3 310.1 346.3 295.8 335.5L117.3 200.1C114 197.6 112 193.6 112 189.4z"/>
            </svg>
          </Link>
          <p>{user.username}</p>
          <DropDownMenu buttonContent={
            <ProfileIcon imgSrc={user.avatar_url} />
          }>
            <DropDownLink label="Profile" to="/profile"/>
            <DropDownLink label="Logout" type="error" action={handleLogout} />
          </DropDownMenu>
        </div>
      ) : (
        <div className="flex gap-4 mr-2">
          <Link to="/login" className="hover:underline">
            Sign in
          </Link>
          <Link to="/register" className="hover:underline">
            Sign up
          </Link>
        </div>
      )}
    </div>
  )
}

export default NavBar