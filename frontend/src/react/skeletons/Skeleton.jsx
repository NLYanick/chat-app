function Skeleton({ className = "" }) {
  return <div className={`skeleton rounded-md ${className}`} aria-hidden="true" />;
}

export function SkeletonAvatar({ size = "w-10 h-10" }) {
  return <div className={`skeleton rounded-full shrink-0 ${size}`} aria-hidden="true" />;
}

export function SkeletonLine({ className = "h-4 w-full" }) {
  return <Skeleton className={className} />;
}

export default Skeleton;