import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthUserContext";
import ProfileIcon from "./ProfileIcon"
import DropDownMenu from "./DropDownMenu";
import DropDownLink from "./DropDownLink";

const noBarRoutes = ['/login', '/register'];

function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex items-center justify-between p-4 w-full fixed border-b-2" style={noBarRoutes.includes(location.pathname) ? { display: "none" } : {}}>
      <p>NAVBAR</p>
      {user ? (
        <div className="flex items-center gap-4">
          <p>{user.username}</p>
          <DropDownMenu
            buttonContent={user.avatar_url && user.avatar_url !== '' ? (
              <img alt="Profile" src={user.avatar_url} />
            ) : (
              <ProfileIcon />
            )}
          >
            <DropDownLink label="Profile" to="/profile"/>
            <DropDownLink label="Logout" type="error" action="/logout" />
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