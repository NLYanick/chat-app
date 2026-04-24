import { useState } from "react";
import Button from "./Button";
import FormInput from "./form/FormInput";
import UserErrorsBox from "./form/UserErrorsBox";
import { sendRequest } from "../utils/requests";
import { useAuth } from "../AuthUserContext";

function ProfileDetails({ user }) {
  const [mailMessage, setMailMessage] = useState("");
  const [userErrors, setUserErrors] = useState([]);

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
    
    const { json } = await sendRequest(`/users/${user.uid}`, 'PATCH', { username: username, email: email });

    if(!json.success) {
      setUserErrors([json.error]);
      return;
    }

    login(json.user);

    setUserErrors([]);

    e.target.submit();
  }

  return (
    <div className='bg-(--primary-color-light) rounded-lg shadow-lg p-6 text-left flex flex-col gap-8'>
      <h2 className='text-2xl'>Details</h2>

      <form onSubmit={changeDetails} className='space-y-4'>
        {userErrors.length > 0 && (
            <UserErrorsBox userErrors={userErrors} />
        )}

        <div>
          <FormInput defaultValue={user.username} label="Username" onChange={(e) => setUsername(e.target.value)} />
          <FormInput defaultValue={user.email} label="Email" onChange={(e) => setEmail(e.target.value)} />
        </div>

        <Button label="Change" />
      </form>

      <div className='flex flex-col gap-2'>
        <Button label="Reset Password" type="secondary" buttonType="button" onClick={resetPassword}/>
        {mailMessage && <em className="text-sm">{mailMessage}</em>}
      </div>
    </div>
  );
}

export default ProfileDetails;