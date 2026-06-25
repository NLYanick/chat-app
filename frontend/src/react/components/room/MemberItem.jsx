import ProfileIcon from "../profile/ProfileIcon"

function MemberItem({ member }) {
  // TODO: show user status correctly
  return (
    <li className='rounded-lg shadow-lg py-2 border flex items-center justify-between px-4'>
      <ProfileIcon imgSrc={member.avatar_url} />
      <p>{member.username}</p>
      <p>{member.status}</p>
    </li>
  )
}

export default MemberItem