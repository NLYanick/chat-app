import Skeleton, { SkeletonAvatar } from "./Skeleton";
 
function RoomListSkeleton({ count = 5 }) {
  return (
    <ul className="space-y-3 p-1" aria-label="Loading rooms">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary-light"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <SkeletonAvatar />
          <Skeleton className="h-4 flex-1" />
        </li>
      ))}
    </ul>
  );
}
 
export default RoomListSkeleton;