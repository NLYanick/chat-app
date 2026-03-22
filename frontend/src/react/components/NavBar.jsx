import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthUserContext";
import { sendRequest } from '../utils/requests';
import ProfileIcon from "./ProfileIcon"
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
      <Link to='/'>Homepage</Link>
      
      {user ? (
        <div className="flex items-center gap-4 mr-2">
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