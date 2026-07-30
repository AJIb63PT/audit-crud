export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      className="border-[3px] border-gray-200 border-t-blue-600 rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  );
}
