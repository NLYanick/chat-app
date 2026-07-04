import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendRequest } from '../utils/requests';
import { useAuth } from "../AuthUserContext";
import Button from "../components/Button"
import ProfileIcon from "../components/profile/ProfileIcon"
import Modal from '../components/Modal';
import ProfileEditor from '../components/profile/ProfileEditor';
import ProfileDetails from '../components/profile/ProfileDetails';
import FormFileInput from '../components/form/FormFileInput';

function Profile() {
  const [error, setError] = useState(null);
  const [userError, setUserError] = useState("");

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const [image, setImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarPreviewIsReady, setAvatarPreviewIsReady] = useState(false);
  const profileEditorRef = useRef(null);

  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!image) {
      setAvatarPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setAvatarPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl); // Free memory whenever this component is unmounted
  }, [image]);

  if (error) throw new Error(error.message);

  const handleInput = async (e) => {
    const newImage = e.target.files[0];
    setImage(newImage);

    if (newImage) {
      setShowAvatarModal(true);
      e.target.value = ''; // Reset the file input
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setUserError('Please select an image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar_url', image);

      const { json, status } = await sendRequest(`/users/${user.uid}/upload-avatar`, 'POST', formData);

      if (status === 201 && json.user) {
        const userData = {
          uid: json.user.uid,
          avatar_url: json.user.avatar_url,
          username: json.user.username,
          email: json.user.email,
          created_at: json.user.created_at,
          disabled: json.user.disabled,
        }

        login(userData);
        setUserError(null);
      } else {
        console.error(json.error);
        setUserError('Failed to upload avatar. Please try again later.');
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    }
  }

  const handleCloseModal = () => {
    setShowAvatarModal(false);
    setUserError(null);

    const croppedCanvas = profileEditorRef.current?.getCroppedImage();

    if (croppedCanvas) {
      croppedCanvas.toBlob((blob) => {
        setImage(blob);

        setAvatarPreviewIsReady(true);
      });
    }
  }

  function showImagePreview() {
    if(avatarPreview && avatarPreviewIsReady) 
      return <img src={avatarPreview} alt="Avatar Preview" className="object-cover max-w-40 sm:max-w-50 rounded-full" />
    else if (avatarPreview && !avatarPreviewIsReady)
      return <p className='font-bold'>Loading preview...</p>
    else 
      return <span className="text-sm text-slate-500">No Preview Image</span>
  }

  const handleDeleteAccount = async () => {
    try {
      const { json } = await sendRequest(`/users/${user.uid}`, 'DELETE');

      if (!json.success) {
        console.error(json.error);
        setRemoveError('Failed to delete account. Please try again later.');
        return;
      }

      setShowDeleteAccountModal(false);
      logout();
      navigate("/auth/login");
    } catch (err) {
      setError(err.message || 'Failed to delete account. Please try again later.');
    }
  }

  return (
    <>
      {showAvatarModal && 
        <Modal 
          onClose={handleCloseModal}
          footer={<Button label="Apply" type="success" onClick={handleCloseModal} />}
        >
          <ProfileEditor
            ref={profileEditorRef}
            imageSrc={avatarPreview}
          />
        </Modal> 
      }

      <div className='flex flex-col gap-8 pb-8 min-w-96'>
        <h1 className='text-4xl font-semibold mt-16 sm:mt-8 mb-4'>Profile</h1>

        <ProfileDetails user={user} />

        <div className='bg-(--primary-color-light) rounded-lg shadow-lg p-6 text-left flex flex-col gap-8'>
          <h2 className='text-2xl'>Avatar</h2>

          <div className='flex justify-center'>
            <ProfileIcon imgSrc={user.avatar_url} size={user.avatar_url ? 'large' : 'medium'} />
          </div>

          <hr className='text-(--secondary-color)' />

          <form className='bg-(--primary-color-light) flex flex-col items-center gap-6' onSubmit={handleSubmit}>
            <h3 className='text-xl w-full text-left'>Change Avatar</h3>

            {showImagePreview()}

            <FormFileInput label="Choose an image" name="avatar" onInput={handleInput} accept="image/*" subtext="Rectangular images like 256x256 work best" />

            {userError && <p className='text-red-500 text-sm'>{userError}</p>}

            <Button label="Upload Avatar" type="success" disabled={!image} />
          </form>
        </div>

        <div className='bg-(--primary-color-light) rounded-lg shadow-lg p-6 text-left flex flex-col gap-8'>
          <h2 className='text-2xl'>Delete Account</h2>
          <p className='text-red-500'>Deleting your account cannot be undone!</p>

          <Button label="Delete Account" type="error" onClick={() => setShowDeleteAccountModal(true)} />

          {showDeleteAccountModal && 
            <Modal 
              onClose={() => setShowDeleteAccountModal(false)}
              footer={
                <div className='flex justify-end gap-4'>
                  <Button label="Cancel" type="secondary" onClick={() => setShowDeleteAccountModal(false)} />
                  <Button label="Remove" type="error" onClick={handleDeleteAccount} />
                </div>
              }
            >
              <h3 className='text-2xl font-bold'>Confirm Account Deletion</h3>
              <p className='text-center'>Are you sure you want to delete your account? This action cannot be undone.</p>
            </Modal> 
          }
        </div>
      </div>
    </>
  );
}

export default Profile