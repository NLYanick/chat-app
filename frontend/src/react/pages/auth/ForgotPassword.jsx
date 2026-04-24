import { useState } from 'react';
import { sendRequest } from '../../utils/requests';
import Form from '../../components/form/AuthForm';
import FormInput from '../../components/form/FormInput';
import UserErrorsBox from '../../components/form/UserErrorsBox';

function ForgotPassword() {
  const [error, setError] = useState(null);
  const [userErrors, setUserErrors] = useState([]);

  const [email, setEmail] = useState('');
  const [mailMessage, setMailMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = checkUserInput(email);
    setUserErrors(validationErrors);

    if (validationErrors.length > 0) return;

    const { json } = await sendRequest('/mails/forgot-password', 'POST', { email });

    if (json.success)
      setMailMessage("Mail sent successfully! \nPlease check your inbox and try logging in again.");
    else
      setMailMessage("Sending mail failed. Please try again later.");
  }

  if (error) throw new Error(error.message);

  return (
    <>
      <div className='flex flex-col gap-12'>
        <Form formLabel='Reset Password' onSubmit={handleSubmit}>
          {userErrors.length > 0 && (
            <UserErrorsBox userErrors={userErrors} />
          )}
          <div>
            <FormInput label="Email" type="email" name="email" required autoCorrect='false' onChange={(e) => setEmail(e.target.value)} />
            {mailMessage && <em className="text-sm">{mailMessage}</em>}
          </div>
        </Form>
      </div>
    </>
  );
}

function checkUserInput(email) {
  const errors = []

  if (!email)
    return errors.push('Vul het email adres in');

  return errors;
}

export default ForgotPassword