import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendRequest } from '../../utils/requests';
import AuthForm from '../../components/form/AuthForm';
import FormInput from '../../components/form/FormInput';
import FormCheckBox from '../../components/form/FormCheckbox';
import UserErrorsBox from '../../components/form/UserErrorsBox';
import { useAuth } from '../../AuthUserContext';

function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [error, setError] = useState('');
  const [userErrors, setUserErrors] = useState([]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(null);

  useEffect(() => {
    if (user) navigate("/");
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = checkUserInput(username, password);
    setUserErrors(validationErrors);

    if (validationErrors.length > 0) return;

    const { json, status } = await sendRequest('/authenticate/login', 'POST', { username, password, staySignedIn: staySignedIn ?? false });

    if (json.success) {
      login(json.user, json.accessToken);
      navigate("/");
    } else if (json.error && status < 500) {
      setUserErrors([json.error]);
    } else if (json.error && status >= 500) {
      setError('Server Error | Please try logging in again later');
    }
  }

  if (error) throw new Error(error);

  return (
    <>
      <div className='flex flex-col gap-12'>
        <AuthForm formLabel='Login' onSubmit={handleSubmit}>
          {userErrors.length > 0 && (
            <UserErrorsBox userErrors={userErrors} />
          )}
          <FormInput label="Username" type="text" name="username" placeholder="Enter your username..." required autoFocus onChange={(e) => setUsername(e.target.value)} />
          <FormInput label="Password" subtext="Must be at least 5 characters long" type="password" name="password" required autoCorrect='false' onChange={(e) => setPassword(e.target.value)} />
          <FormCheckBox label="Stay signed in" name="stay-signed-in" onChange={(checked) => setStaySignedIn(checked)} />
        </AuthForm>

        <div className='flex justify-between'>
          <Link to="/forgot-password" className='text-sm hover:underline self-end'>Forgot Your Password?</Link>
          <Link to="/register" className='text-sm hover:underline self-end'>No account yet?</Link>
        </div>
      </div>
    </>
  );
}

function checkUserInput(username, password) {
  const errors = []

  if (!username || !password)
    return errors.push('Fill in your login credentials');

  if (password.length < 5) errors.push("Password must be at least 5 characters long");

  return errors;
}

export default Login