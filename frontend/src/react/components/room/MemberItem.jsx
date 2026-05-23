import ProfileIcon from "../profile/ProfileIcon"

function MemberItem({ member }) {
  return (
    <li className='rounded-lg shadow-lg py-2 border flex items-center justify-between px-4'>
      <ProfileIcon imgSrc={member.avatar_url} />
      <p>{member.username}</p>
    </li>
  )
}

export default MemberItem