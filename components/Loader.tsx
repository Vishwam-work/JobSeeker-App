"use client";

export default function Loader({ show, text = "Loading..." }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600" />
        <p className="text-sm text-gray-700">{text}</p>
      </div>
    </div>
  );
}
