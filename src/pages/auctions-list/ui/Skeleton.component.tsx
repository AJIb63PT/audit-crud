interface Props {
  count?: number;
}

export function Skeleton({ count = 6 }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="h-5 w-2/5 bg-gray-200 rounded mb-3 animate-pulse" />
          <div className="h-4 w-3/5 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-4 w-[30%] bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
