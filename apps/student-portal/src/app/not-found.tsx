import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-white">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-white/60 mb-8">Page not found</p>
      <Link href="/" className="btn-primary">Go Back Home</Link>
    </div>
  );
}
