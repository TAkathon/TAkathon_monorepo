export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-950 to-primary-dark">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
          TAkathon
        </h1>
        <p className="text-xl text-gray-300 text-center max-w-2xl">
          Build better hackathon teams with AI-powered teammate matching
        </p>
        <div className="flex gap-4 mt-8">
          <a
            href="/auth/register"
            className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-gray-950 shadow-md hover:bg-gray-100 transition-colors"
          >
            Join as Student
          </a>
          <a
            href="/auth/register"
            className="rounded-lg border-2 border-white px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Create Hackathon
          </a>
        </div>
      </div>
    </main>
  )
}
