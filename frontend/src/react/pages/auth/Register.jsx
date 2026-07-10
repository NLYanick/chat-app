import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendRequest } from '../../../utils/requests';
import { useAuth } from '../../AuthUserContext';
import AuthForm from '../../components/form/AuthForm';
import FormInput from '../../components/form/FormInput';
import FormCheckBox from '../../components/form/FormCheckbox';
import UserErrorsBox from '../../components/form/UserErrorsBox';
import { useEffect } from 'react';
import AuthLayout from '../../layouts/AuthLayout';

function Register() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [error, setError] = useState(null);
  const [userErrors, setUserErrors] = useState([]);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = checkUserInput(username, password, confirmPassword, email);
    setUserErrors(validationErrors);

    if (validationErrors.length > 0) return;

    const { json, status } = await sendRequest('/authenticate/register', 'POST', { email, username, password, confirmPassword, staySignedIn: staySignedIn ?? false });

    if (json.success) {
      login(json.user, json.accessToken);
      navigate("/");
    } else if (json.error && status < 500) {
      setUserErrors([json.error]);
    } else if (json.error && status >= 500) {
      setError('Server Error | Please try registering again later');
    }
  }

  if (error) throw new Error(error.message);

  return (
    <AuthLayout>
      <AuthForm formLabel='Register' onSubmit={handleSubmit}>
        {userErrors.length > 0 && (
          <UserErrorsBox userErrors={userErrors} />
        )}
        <FormInput label="Email" type="email" name="email" placeholder="Enter your email..." required autoFocus onChange={(e) => setEmail(e.target.value)} />
        <FormInput label="Username" type="text" name="username" placeholder="Enter your username..." required autoFocus onChange={(e) => setUsername(e.target.value)} />
        <div>
          <FormInput label="Password" subtext="Must be at least 5 characters long" type="password" name="password" required autoCorrect='false' onChange={(e) => setPassword(e.target.value)} />
          <FormInput label="Confirm Password" subtext="Must be equal to 'Password'" type="password" name="confirm_password" required autoCorrect='false' onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <FormCheckBox label="Stay signed in" name="stay-signed-in" onChange={(checked) => setStaySignedIn(checked)} />
      </AuthForm>
      
      <div className='flex justify-center w-full'>
        <Link to="/login" className='text-sm hover:underline self-end text-gray-100'>Already have an account?</Link>
      </div>
    </AuthLayout>
  );
}

function checkUserInput(username, password, confirmPassword, email) {
  const errors = []

  if (!username || !password || !email) {
    errors.push('Fill in your registration credentials');
    return errors;
  }

  if (password.length < 5) errors.push("Password must be at least 5 characters long");
  if (password !== confirmPassword) errors.push("'Confirm Password' must be equal to 'Password'");

  return errors;
}

export default Register