import { useEffect, useState } from "react";
import Button from "../../components/Button"
import FormColorField from "../../components/form/FormColorField"
import FormInput from "../../components/form/FormInput"
import FormTextField from "../../components/form/FormTextField"
import { sendRequest } from "../../utils/requests";
import { useNavigate, useParams } from "react-router-dom";
import UserErrorsBox from "../../components/form/UserErrorsBox";
import FormFileInput from "../../components/form/FormFileInput";
import Modal from "../../components/Modal";
import { useAuth } from "../../AuthUserContext";
import { useImagePreview } from "../../../hooks/useImagePreview";
import LinkButton from "../../components/LinkButton";

function EditRoom() {
  const { roomId } = useParams();

  const [userErrors, setUserErrors] = useState([]);
  const [deleteErrors, setDeleteErrors] = useState([]);

  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  
  const [modalOpen, setModalOpen] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const hookImagePreview = useImagePreview(image);

  const displayPreview = hookImagePreview || imagePreview;
  
  useEffect(() => {
    async function fetchRoom() {
      const { json } = await sendRequest(`/rooms/${roomId}`, 'GET');

      if(!json.success) {
        setUserErrors([json.error || "Failed to fetch room details"]);
        return;
      }

      if(json.room.owner !== user.uid) {
        navigate('/rooms/' + roomId);
        return;
      }

      setName(json.room.name);
      setColor(json.room.color_hex);
      setDescription(json.room.description);

      if(json.room.image) {
        const imageURL = `${import.meta.env.VITE_BACKEND_URL}/public${json.room.image}`;
        setImagePreview(imageURL);
      }
    }
    fetchRoom();
  }, [roomId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('color_hex', color);
    formData.append('sender', user.uid);
    formData.append('room_image', image);

    const { json } = await sendRequest(`/rooms/${roomId}`, 'PATCH', formData);

    if(!json.success) {
      setUserErrors([json.error]);
      return;
    }

    setUserErrors([]);

    navigate('/rooms/' + json.room.uid);
  }

  const onDelete = async () => {
    const { json } = await sendRequest(`/rooms/${roomId}`, 'DELETE', { sender: user.uid });
    
    if (json.success) {
      navigate('/rooms');
    } else {
      setDeleteErrors([json.error || "Failed to delete room. Please report this issue."]);
    }
  }

  return (
    <div className="space-y-12 mb-4">
      <h1 className='text-4xl sm:text-5xl'>Edit Room</h1>

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
          <Button label="Save Changes" type="success" />
          <LinkButton label="Cancel" type="secondary" to={`/rooms/${roomId}`} />
        </div>
      </form>
      
      <div className="w-full sm:max-w-lg bg-(--primary-color-light) p-4 sm:p-8 rounded-lg shadow-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4">Delete Room</h2>
        <p className="mb-4 text-sm text-gray-100">Deleting this room is permanent and cannot be undone. Please proceed with caution.</p>

        {deleteErrors.length > 0 && (
          <UserErrorsBox userErrors={deleteErrors} />
        )}

        <Button type="error" buttonType="button" label="Delete" onClick={() => setModalOpen(true)}></Button>

        {modalOpen && (
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            footer={
              <div className="flex justify-end gap-4">
                <Button type="secondary" buttonType="button" label="Cancel" onClick={() => setModalOpen(false)}></Button> 
                <Button type="error" buttonType="button" label="Delete" onClick={onDelete}></Button>
              </div>
            }
          >
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="text-gray-100">Are you sure you want to delete this room? This action cannot be undone.</p>
          </Modal>
        )}
      </div>
    </div>
  )
}

export default EditRoom