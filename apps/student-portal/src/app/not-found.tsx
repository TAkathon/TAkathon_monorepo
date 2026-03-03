import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1A0A00] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#D94C1A]">404</h1>
        <p className="text-white/60 mt-4 text-lg">Page not found</p>
        <p className="text-white/40 mt-2 text-sm">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block btn-primary px-6 py-2 rounded"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
