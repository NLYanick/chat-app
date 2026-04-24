import { useState } from "react";
import Button from "./Button";
import FormInput from "./form/FormInput";
import { sendRequest } from "../utils/requests";

function ProfileDetails({ user }) {
  const [mailMessage, setMailMessage] = useState("");
  const [userErrors, setUserErrors] = useState([]);

  const resetPassword = async () => {
    const { json } = await sendRequest('/mails/reset-password', 'POST', { userUid: user.uid });

    if(json.success)
      setMailMessage("Mail sent successfully!");
    else 
      setMailMessage("Sending mail failed. Please try again later.");
  }

  return (
    <div className='bg-(--primary-color-light) rounded-lg shadow-lg p-6 text-left flex flex-col gap-8'>
      <h2 className='text-2xl'>Details</h2>

      <form onSubmit={() => console.log('submit')} className='space-y-4'>
        {userErrors.length > 0 && (
            <UserErrorsBox userErrors={userErrors} />
        )}

        <div>
          <FormInput value={user.username} readOnly label="Username" />
          <FormInput value={user.email} readOnly label="Email" />
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