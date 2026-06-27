import { useEffect, useState } from "react";
import Button from "../../components/Button"
import FormColorField from "../../components/form/FormColorField"
import FormInput from "../../components/form/FormInput"
import FormTextField from "../../components/form/FormTextField"
import { sendRequest } from "../../utils/requests";
import { useNavigate } from "react-router-dom";
import UserErrorsBox from "../../components/form/UserErrorsBox";
import FormFileInput from "../../components/form/FormFileInput";
import { useAuth } from "../../AuthUserContext";
import { useImagePreview } from "../../../hooks/useImagePreview";

function CreateRoom() {
  const [userErrors, setUserErrors] = useState([]);

  const [name, setName] = useState('');
  const [color, setColor] = useState('#2f6cac');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();
  const hookImagePreview = useImagePreview(image);

  const displayPreview = hookImagePreview || imagePreview;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('room_image', image);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('color_hex', color);
    formData.append('room_owner', user.uid);

    const { json } = await sendRequest('/rooms', 'POST', formData);

    if(!json.success) {
      setUserErrors([json.error]);
      return;
    }

    setUserErrors([]);

    navigate('/rooms/' + json.room.uid);
  }

  return (
    <div className="space-y-12 mb-4">
      <h1 className='text-4xl sm:text-5xl'>Create Room</h1>

      <form className="w-full sm:max-w-lg bg-(--primary-color-light) p-4 sm:p-8 rounded-lg shadow-md flex flex-col gap-4" onSubmit={handleSubmit}>
        {userErrors.length > 0 && (
          <UserErrorsBox userErrors={userErrors} />
        )}

        <FormInput label="Room Name" subtext="Room name can be maximum 50 characters" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Room Name' maxLength={50} required />

        <FormColorField label="Color" value={color} onChange={(newColor) => setColor(newColor)} required />

        <FormTextField label="Description" subtext="Room description can be maximum 500 characters" value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Description' maxLength={500} />

        <div className="mb-6 flex flex-col items-center">
          <FormFileInput label="Room Avatar" name="image" accept="image/*" onInput={(e) => setImage(e.target.files[0])} subtext="Square images are better (e.g. 500x500 px)" />

          {displayPreview ? (
            <div className="mt-4 flex justify-center">
              <img src={displayPreview} alt="Avatar Preview" className="object-cover size-40 sm:size-50 rounded-full" />
            </div>
          ) : (
            <p className='text-sm text-slate-500 mt-2'>No preview available</p>
          )}
        </div>

        <div className="flex justify-between">
          <Button label="Create" type="success" />
          <Button label="Cancel" type="secondary" buttonType="button" onClick={() => navigate('/')} />
        </div>
      </form>
    </div>
  )
}

export default CreateRoom