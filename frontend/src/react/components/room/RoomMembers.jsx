import Button from "../Button";
import MemberItem from "./MemberItem";

function RoomMembers({ members, userIsOwner }) {
  if (!members) return <p>Loading members...</p>;

  // TODO: Icon for owner, invite functionality, remove member functionality
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-bold">Members</h2>
      
      <ul className="space-y-4">
        {members.map(member => (
          <MemberItem key={member.uid} member={member} />
        ))}
      </ul>

      {userIsOwner && (
        <Button type="primary" label="Invite User"></Button>
      )}
    </div>
  );
}

export default RoomMembers