import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { sendRequest } from '../../utils/requests';
import { useAuth } from '../../AuthUserContext';
import Form from '../../components/form/AuthForm';
import FormInput from '../../components/form/FormInput';
import UserErrorsBox from '../../components/form/UserErrorsBox';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

  const [error, setError] = useState(null);
  const [userErrors, setUserErrors] = useState([]);
  const [validToken, setValidToken] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    async function validateToken() {
      const token = new URLSearchParams(location.search).get('token');
      const { json } = await sendRequest(`/authenticate/verify-token/${token}`, 'GET');

      setValidToken(json.success);
    }
    validateToken();
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = checkUserInput(password, confirmPassword);
    setUserErrors(validationErrors);

    if (validationErrors.length > 0) return;

    const token = new URLSearchParams(location.search).get('token');

    const { json, status } = await sendRequest('/authenticate/reset-password', 'POST', { new_password: password, token });
    setValidToken(json.success);

    if (json.success) {
      navigate("/login");
    } else if (json.error && status < 500) {
      setUserErrors([json.error]);
    } else if (json.error && status >= 500) {
      setError('Server Error | Please try resetting your password again later');
    }
  }

  if (error) throw new Error(error.message);
  if (!validToken) {
    return (
      <>
        <h1 className='mb-8 text-4xl font-bold'>Invalid or expired token</h1><p>Please click the "Reset Password" button again in the profile page. You have 1 hour to reset your password.</p>
      </>
    );
  }

  return (
    <>
      <div className='flex flex-col gap-12'>
        <Form formLabel='Reset Password' onSubmit={handleSubmit}>
          {userErrors.length > 0 && (
            <UserErrorsBox userErrors={userErrors} />
          )}
          <div>
            <FormInput label="Wachtwoord" subtext="Moet minimaal 5 karakters lang zijn" type="password" name="password" required autoCorrect='false' onChange={(e) => setPassword(e.target.value)} />
            <FormInput label="Bevestig Wachtwoord" subtext="Moet gelijk zijn aan 'Wachtwoord'" type="password" name="confirm_password" required autoCorrect='false' onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </Form>
      </div>
    </>
  );
}

function checkUserInput(password, confirmPassword) {
  const errors = []

  if (!password || !confirmPassword)
    return errors.push('Vul de wachtwoorden in');

  if (password.length < 5) errors.push("Wachtwoord moet minimaal 5 karakters lang zijn");
  if (password !== confirmPassword) errors.push("'Bevestig Wachtwoord' moet gelijk zijn aan 'Wachtwoord'");

  return errors;
}

export default ResetPassword