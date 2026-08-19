export function UserMessage({ message }: { message: string }) {
  return (
    <div className="mt-6 flex justify-end">
      <p className="max-w-[85%] rounded-card bg-primary px-4 py-3 text-white">{message}</p>
    </div>
  );
}
