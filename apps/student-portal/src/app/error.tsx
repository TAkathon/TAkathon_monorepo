"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-4xl font-bold text-primary mb-4">Something went wrong!</h1>
      <p className="text-white/60 mb-8 max-w-md text-center">
        {error.message || "An unexpected error occurred."}
      </p>
      <button onClick={() => reset()} className="btn-primary">
        Try again
      </button>
    </div>
  );
}
