import { useState } from "react";
import Button from "../Button";
import FormInput from "../form/FormInput";
import UserErrorsBox from "../form/UserErrorsBox";
import Modal from '../Modal';
import { sendRequest } from "../../utils/requests";
import { useAuth } from "../../AuthUserContext";

function ProfileDetails({ user }) {
  if(!user) return null;

  const [userErrors, setUserErrors] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [mailMessage, setMailMessage] = useState("");

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const { login, user: authUser } = useAuth();

  const isAuthUser = authUser && authUser.uid === user.uid;

  const resetPassword = async () => {
    const { json } = await sendRequest('/mails/reset-password', 'POST', { userUid: user.uid });

    if(json.success)
      setMailMessage("Mail sent successfully!");
    else 
      setMailMessage("Sending mail failed. Please try again later.");
  }

  const changeDetails = async (e) => {
    e.preventDefault();
    
    const { json } = await sendRequest(`/users/${user.uid}`, 'PATCH', { username, email });

    if(!json.success) {
      setUserErrors([json.error]);
      return;
    }

    const userData = {
      uid: json.user.uid,
      avatar_url: json.user.avatar_url,
      username: json.user.username,
      email: json.user.email,
      created_at: json.user.created_at,
      disabled: json.user.disabled,
    }

    login(userData);
    setUserErrors([]);

    e.target.submit();
  }

  return (
    <>
      {modalIsOpen && isAuthUser && <Modal 
        onClose={() => setModalIsOpen(false)}
        footer={
          <div className="flex gap-8">
            <Button label="Yes" type="success" onClick={() => {
              resetPassword();
              setModalIsOpen(false);
            }} />
            <Button label="No" type="error" onClick={() => setModalIsOpen(false)} />
          </div>
        }
      >
          <p>Are you sure you want to reset your password?</p>
      </Modal> }

      <div className='bg-(--primary-color-light) rounded-lg shadow-lg p-6 text-left flex flex-col gap-8'>
        <h2 className='text-2xl'>Details</h2>

        <form onSubmit={changeDetails} className='space-y-4'>
          {userErrors.length > 0 && (
              <UserErrorsBox userErrors={userErrors} />
          )}

          <div>
            <FormInput value={username} label="Username" onChange={(e) => setUsername(e.target.value)} readOnly={!isAuthUser} />
            <FormInput value={email} label="Email" onChange={(e) => setEmail(e.target.value)} readOnly={!isAuthUser} />
          </div>

          {isAuthUser && <Button label="Change" />}
        </form>
        
        {isAuthUser && (
          <div className='flex flex-col gap-2'>
            <Button label="Reset Password" type="secondary" buttonType="button" onClick={() => setModalIsOpen(true)}/>
            {mailMessage && <em className="text-sm">{mailMessage}</em>}
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileDetails;