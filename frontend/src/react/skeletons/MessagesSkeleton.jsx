import Skeleton, { SkeletonAvatar } from "../Skeleton";

function MessagesSkeleton() {
  const rows = [
    { align: "start", width: "w-2/5" },
    { align: "end", width: "w-1/3" },
    { align: "start", width: "w-1/2" },
    { align: "start", width: "w-1/4" },
    { align: "end", width: "w-2/5" },
  ];

  return (
    <div className="flex flex-col gap-4 py-4" aria-label="Loading messages">
      {rows.map((row, i) => (
        <div
          key={i}
          className={`flex gap-2 ${row.align === "end" ? "flex-row-reverse" : ""}`}
        >
          <SkeletonAvatar />
          <div className={`flex flex-col gap-2 ${row.align === "end" ? "items-end" : "items-start"}`}>
            <Skeleton className="h-3 w-24" />
            <Skeleton className={`h-10 rounded-2xl ${row.width}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessagesSkeleton;