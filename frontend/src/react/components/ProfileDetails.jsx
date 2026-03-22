import FormButton from "./form/FormButton";

function ProfileDetails({ user }) {
  return (
    <div className='bg-(--primary-color-light) rounded-lg shadow-lg p-6 text-left flex flex-col gap-8'>
      <h2 className='text-2xl'>Details</h2>

      <form method='post' className='flex justify-between'>
        <p>{user.username}</p>
        <FormButton label="Change" />
      </form>
    {/* TODO User Details */}
    </div>
  );
}

export default ProfileDetails;