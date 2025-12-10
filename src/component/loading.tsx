export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen z-10000">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      
      {/* Text */}
      <p className="mt-4 text-white text-lg font-semibold">Loading...</p>
    </div>
  );
}
