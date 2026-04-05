import { useState } from "react";
import Button from "./Button";
import { sendRequest } from "../utils/requests";

function ProfileDetails({ user }) {
  const [mailMessage, setMailMessage] = useState("");

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

      <div className='flex justify-between'>
        <p>{user.username}</p>
        <Button label="Change" />
      </div>

      <div className='flex flex-col gap-2'>
        <Button label="Reset Password" onClick={resetPassword}/>
        {mailMessage && <em className="text-sm">{mailMessage}</em>}
      </div>
    </div>
  );
}

export default ProfileDetails;