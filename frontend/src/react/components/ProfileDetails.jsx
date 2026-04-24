import { useState } from "react";
import Button from "./Button";
import FormInput from "./form/FormInput";
import UserErrorsBox from "./form/UserErrorsBox";
import Modal from '../components/Modal';
import { sendRequest } from "../utils/requests";
import { useAuth } from "../AuthUserContext";

function ProfileDetails({ user }) {
  const [userErrors, setUserErrors] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [mailMessage, setMailMessage] = useState("");

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const { login } = useAuth();

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

    login(json.user);
    setUserErrors([]);

    e.target.submit();
  }

  return (
    <>
      <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
          <p>Are you sure you want to reset your password?</p>
          <div className="flex gap-8">
            <Button label="Yes" type="success" onClick={() => {
              resetPassword();
              setModalIsOpen(false);
            }} />
            <Button label="No" type="error" onClick={() => setModalIsOpen(false)} />
          </div>
      </Modal>

      <div className='bg-(--primary-color-light) rounded-lg shadow-lg p-6 text-left flex flex-col gap-8'>
        <h2 className='text-2xl'>Details</h2>

        <form onSubmit={changeDetails} className='space-y-4'>
          {userErrors.length > 0 && (
              <UserErrorsBox userErrors={userErrors} />
          )}

          <div>
            <FormInput value={user.username} label="Username" onChange={(e) => setUsername(e.target.value)} />
            <FormInput value={user.email} label="Email" onChange={(e) => setEmail(e.target.value)} />
          </div>

          <Button label="Change" />
        </form>

        <div className='flex flex-col gap-2'>
          <Button label="Reset Password" type="secondary" buttonType="button" onClick={() => setModalIsOpen(true)}/>
          {mailMessage && <em className="text-sm">{mailMessage}</em>}
        </div>
      </div>
    </>
  );
}

export default ProfileDetails;