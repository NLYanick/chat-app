import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthUserContext";
import { sendRequest } from '../../utils/requests';
import ProfileIcon from "./profile/ProfileIcon"
import DropDownMenu from "./DropDownMenu";
import DropDownLink from "./DropDownLink";
import { useEffect, useRef, useState } from "react";
import { subscribeToEvent } from "../../utils/socket-client";

const noBarRoutes = ['/login', '/register'];

function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [hasNotifications, setHasNotifications] = useState(false);
  
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    if (!user) return;

    const unsubsribe = subscribeToEvent('notification_received', ({ user_id }) => {
      if (user_id === user.uid) {
        setHasNotifications(true);
      }
    });

    return () => unsubsribe();
  }, [user]);

  useEffect(() => {
    if (hasNotifications && previousPathRef.current === "/notifications" && location.pathname !== "/notifications") {
      setHasNotifications(false);
    }

    async function checkNotifications() {
      if (previousPathRef.current === "/login" && location.pathname !== "/login" && location.pathname !== "/register" && user) {
        const { json: friendRequestsData } = await sendRequest('/friend-requests/user/' + user?.uid, 'GET');
        const { json: roomInvitesData } = await sendRequest('/room-invites/user/' + user?.uid, 'GET');

        if (!roomInvitesData.success || !friendRequestsData.success) {
          console.error("Failed to fetch notifications:", roomInvitesData.error || friendRequestsData.error);
          return;
        }

        if (friendRequestsData?.friend_requests?.length > 0 || roomInvitesData?.room_invites?.length > 0) {
          setHasNotifications(true);
        }
      }
    }
    checkNotifications();

    previousPathRef.current = location.pathname;
  }, [location.pathname]);

  const handleLogout = async () => {
    const { json } = await sendRequest('/authenticate/logout', 'POST', { user_id: user.uid });

    if(json.success) {
      logout();
      navigate("/");
    } else {
      throw new Error("Could not logout.");
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 w-full fixed border-b-2 h-15 bg-(--primary-color)" style={noBarRoutes.includes(location.pathname) ? { display: "none" } : {}}>
      <div>
        <Link to='/'>ChatApp</Link>
      </div>
      
      {user ? (
        <div className="flex items-center gap-4 mr-2">
          <Link to="/friends" className="hover:underline relative" onClick={() => setHasNotifications(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-8 h-8 fill-white">
              <path d="M96 192C96 130.1 146.1 80 208 80C269.9 80 320 130.1 320 192C320 253.9 269.9 304 208 304C146.1 304 96 253.9 96 192zM32 528C32 430.8 110.8 352 208 352C305.2 352 384 430.8 384 528L384 534C384 557.2 365.2 576 342 576L74 576C50.8 576 32 557.2 32 534L32 528zM464 128C517 128 560 171 560 224C560 277 517 320 464 320C411 320 368 277 368 224C368 171 411 128 464 128zM464 368C543.5 368 608 432.5 608 512L608 534.4C608 557.4 589.4 576 566.4 576L421.6 576C428.2 563.5 432 549.2 432 534L432 528C432 476.5 414.6 429.1 385.5 391.3C408.1 376.6 435.1 368 464 368z"/>
            </svg>
          </Link>
          <Link to="/notifications" className="hover:underline relative" onClick={() => setHasNotifications(false)}>
            {hasNotifications && (
              <div className="w-3 h-3 rounded-full bg-red-500 absolute top-0 right-1"></div>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-8 h-8 fill-white">
              <path d="M320 64C306.7 64 296 74.7 296 88L296 97.7C214.6 109.3 152 179.4 152 264L152 278.5C152 316.2 142 353.2 123 385.8L101.1 423.2C97.8 429 96 435.5 96 442.2C96 463.1 112.9 480 133.8 480L506.2 480C527.1 480 544 463.1 544 442.2C544 435.5 542.2 428.9 538.9 423.2L517 385.7C498 353.1 488 316.1 488 278.4L488 263.9C488 179.3 425.4 109.2 344 97.6L344 87.9C344 74.6 333.3 63.9 320 63.9zM488.4 432L151.5 432L164.4 409.9C187.7 370 200 324.6 200 278.5L200 264C200 197.7 253.7 144 320 144C386.3 144 440 197.7 440 264L440 278.5C440 324.7 452.3 370 475.5 409.9L488.4 432zM252.1 528C262 556 288.7 576 320 576C351.3 576 378 556 387.9 528L252.1 528z"/>
            </svg>
          </Link>
          <p>{user.username}</p>
          <DropDownMenu buttonContent={
            <ProfileIcon imgSrc={user.avatar_url} />
          }>
            <DropDownLink label="Profile" to="/profile/me"/>
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
    </nav>
  )
}

export default NavBar