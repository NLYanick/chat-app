import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendRequest } from '../../utils/requests';
import Form from '../../components/form/Form';
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
      login(json.user);
      navigate("/");
    } else if (json.error && status < 500) {
      setUserErrors([json.error]);
    } else if (json.error && status >= 500) {
      setError('Server Error | Please try loging in again later');
    }
  }

  if (error) throw new Error(error);

  return (
    <>
      <div className='flex flex-col gap-12'>
        <Form formLabel='Inloggen' onSubmit={handleSubmit}>
          {userErrors.length > 0 && (
            <UserErrorsBox userErrors={userErrors} />
          )}
          <FormInput label="Username" type="text" name="username" placeholder="Enter your username..." required autoFocus onChange={(e) => setUsername(e.target.value)} />
          <FormInput label="Wachtwoord" subtext="Moet minimaal 5 karakters lang zijn" type="password" name="password" required autoCorrect='false' onChange={(e) => setPassword(e.target.value)} />
          <FormCheckBox label="Blijf ingelogd" name="stay-signed-in" onChange={(checked) => setStaySignedIn(checked)} />
        </Form>

        <div className='flex justify-between'>
          <Link to="/forgot-password" className='text-sm hover:underline self-end'>Wachtwoord vergeten?</Link>
          <Link to="/register" className='text-sm hover:underline self-end'>Nog geen account?</Link>
        </div>
      </div>
    </>
  );
}

function checkUserInput(username, password) {
  const errors = []

  if (!username || !password)
    return errors.push('Vul de inloggevens in');

  if (password.length < 5) errors.push("Wachtwoord moet minimaal 5 karakters lang zijn");

  return errors;
}

export default Login