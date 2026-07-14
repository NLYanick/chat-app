import Skeleton, { SkeletonAvatar } from "./Skeleton";

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-8 pb-8 min-w-96 w-full" aria-label="Loading profile">
      <Skeleton className="h-10 w-48 mt-16 sm:mt-8" />

      <div className="bg-primary-light rounded-lg shadow-lg p-6 flex flex-col items-center gap-6">
        <Skeleton className="h-6 w-40" />
        <SkeletonAvatar size="w-32 h-32" />
      </div>

      <div className="bg-primary-light rounded-lg shadow-lg p-6 flex flex-col gap-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default ProfileSkeleton;