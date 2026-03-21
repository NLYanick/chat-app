import { useState, useEffect, useRef } from 'react';
import { sendRequest } from '../utils/requests';
import { useAuth } from "../AuthUserContext";
import FormButton from "../components/form/FormButton"
import ProfileIcon from "../components/ProfileIcon"
import Modal from '../components/Modal';
import ProfileEditor from '../components/ProfileEditor';

function Profile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarPreviewIsReady, setAvatarPreviewIsReady] = useState(false);
  const profileEditorRef = useRef(null);

  const { user, login } = useAuth();

  useEffect(() => {
    if (!image) {
      setAvatarPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setAvatarPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl); // Free memory whenever this component is unmounted
  }, [image]);

  if (loading) return (<p className='font-bold'>Loading...</p>);
  if (error) throw new Error(error.message);

  const handleInput = async (e) => {
    const newImage = e.target.files[0];
    setImage(newImage);

    if(newImage) setModalIsOpen(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!image) return;

    try {
      const formData = new FormData();
      formData.append('avatar_url', image);
      
      const { json, status } = await sendRequest(`/users/${user.id}/upload-avatar`, 'POST', formData);

      if (status === 201 && json.user) {
        login(json.user);
      } else {
        setError(json.error || 'Failed to upload avatar');
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    }
  }

  const handleCloseModal = () => {
    setModalIsOpen(false);
    
    const croppedCanvas = profileEditorRef.current?.getCroppedImage();
    
    if (croppedCanvas) {
      croppedCanvas.toBlob((blob) => {
        
        
        setImage(blob);

        setAvatarPreviewIsReady(true);
      });
    }
  }

  return (
    <>
      <Modal isOpen={modalIsOpen} onClose={handleCloseModal} buttonLabel="Apply">
        <ProfileEditor 
          ref={profileEditorRef}
          imageSrc={avatarPreview}
        />
      </Modal>

      <div className='flex flex-col gap-8 pb-8'>
        <h1 className='text-4xl font-semibold mt-16 sm:mt-8 mb-4'>Profile</h1>

        <div className='bg-(--primary-color-light) rounded-lg shadow-lg p-6 text-left flex flex-col gap-8'>
          <h2 className='text-2xl'>Details</h2>
          {/* TODO User Details */}
        </div>

        <div className='bg-(--primary-color-light) rounded-lg shadow-lg p-6 text-left flex flex-col gap-8'>
          <h2 className='text-2xl'>Avatar</h2>

          <div className='flex justify-center'>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="avatar" className='rounded-full w-40 sm:w-50' />
            ) : (
              <div>
                <ProfileIcon size='w-20 h-20' />
                <p className='text-sm text-center italic mt-1'>No Avatar</p>
              </div>
            )}
          </div>

          <hr className='text-(--secondary-color)' />

          <form className='bg-(--primary-color-light) flex flex-col items-center gap-6' onSubmit={handleSubmit}>
            <span>{image ? image.name : 'No image'}</span>

            {(avatarPreview && avatarPreviewIsReady) ? (
              <img src={avatarPreview} alt="Avatar Preview" className="object-cover max-w-40 sm:max-w-50 rounded-full" />
            ) : (
              <span className="text-sm text-slate-500">No Image</span>
            )}

            <div>
              <label htmlFor="avatar">
                <input type="file"  name="avatar" id="avatar" className='absolute opacity-0 size-0' accept="image/*" required onInput={handleInput} />

                <span className='cursor-pointer bg-(--secondary-color) p-2 rounded-md block w-64 text-center'>Choose an image</span>
              </label>
              <span className='text-sm'><em>Rectangular images like 256x256 work best</em></span>
            </div>

            <FormButton />
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile