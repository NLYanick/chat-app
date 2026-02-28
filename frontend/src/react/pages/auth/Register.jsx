import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendRequest } from '../../utils/requests';
import { useAuth } from '../../AuthUserContext';
import Form from '../../components/form/Form';
import FormInput from '../../components/form/FormInput';
import FormCheckBox from '../../components/form/FormCheckbox';
import UserErrorsBox from '../../components/form/UserErrorsBox';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState(null);
  const [userErrors, setUserErrors] = useState([]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = checkUserInput(username, password, confirmPassword);
    setUserErrors(validationErrors);

    if(validationErrors.length > 0) return;

    const { json, status } = await sendRequest('/authenticate/register', 'POST', { username, password, confirmPassword, staySignedIn: staySignedIn ?? false });

    if (json.success) {
      login(json.user);
      navigate("/");
    } else if(json.error && status < 500) {
      setUserErrors([json.error]);
    } else if(json.error && status >= 500) {
      setError('Server Error | Please try registrating again later');
    }
  }

  if (error) throw new Error(error.message);

  return (
    <>
      <div className='flex flex-col gap-12'>
        <Form formLabel='Inloggen' onSubmit={handleSubmit}>
          {userErrors.length > 0 && (
            <UserErrorsBox userErrors={userErrors} />
          )}
          <FormInput label="Username" type="text" name="username" placeholder="Enter your username..." required autoFocus onChange={(e) => setUsername(e.target.value)} />
          <div>
            <FormInput label="Wachtwoord" subtext="Moet minimaal 5 karakters lang zijn" type="password" name="password" required autoCorrect='false' onChange={(e) => setPassword(e.target.value)} />
            <FormInput label="Bevestig Wachtwoord" subtext="Moet gelijk zijn aan 'Wachtwoord'" type="password" name="confirm_password" required autoCorrect='false' onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <FormCheckBox label="Blijf ingelogd" name="stay-signed-in" onChange={(checked) => setStaySignedIn(checked)} />
        </Form>
      </div>
    </>
  );
}

function checkUserInput(username, password, confirmPassword) {
  const errors = []

  if (!username || !password) 
    return errors.push('Vul de inloggevens in');
  
  if(password.length < 5) errors.push("Wachtwoord moet minimaal 5 karakters lang zijn");
  if(password !== confirmPassword) errors.push("'Bevestig Wachtwoord' moet gelijk zijn aan 'Wachtwoord'");

  return errors;
}

export default Register