'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <header className="bg-green-100 flex items-center justify-between py-4 px-6">
        <div className="rounded bg-red-600 text-lg text-white font-bold px-4 py-2">
          myStudySpace
        </div>
        <Link href="/whiteboard" className="flex items-center gap-2 px-4 bg-black text-white rounded py-2">
      <span>Open Whiteboard (should be login)</span>
    </Link>
      </header>

      {/* Main Section */}
      <main className="p-8 flex flex-1 flex-col md:flex-row gap-8 justify-center items-center bg-green-600">
        
        {/* GIF Display */}
        <div className="text-center w-80 flex h-80 justify-center items-center bg-gray-300 text-gray-600">
          <img src="/cat-spinning.gif" alt="App preview coming soon" />
        </div>

        {/* Features List */}
        <section className="max-w-md flex flex-col gap-6 text-white">
          <div>
            <h2 className="font-bold mb-2">Tailor Your Study Sessions</h2>
            <p className="rounded bg-green-300 p-3 text-green-900">
              Customize your workspace with widgets built to boost your focus.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-bold">Tired of Juggling Tabs?</h2>
            <p className="p-3 text-green-900 rounded bg-green-300">
              Find everything you need in one place, powered by smart tools.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-bold">Zero Ads, Zero Distractions</h2>
            <p className="bg-green-300 p-3 text-green-900 rounded">
              We’re built for students, not ad revenue — goodbye Quizlet clutter.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
