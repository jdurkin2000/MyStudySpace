"use client";
import Image from "next/image";
import connectMongoDB from "../../config/mongodb";

export default function HomePage() {
  connectMongoDB();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Section */}
      <main className="p-8 flex flex-1 flex-col md:flex-row gap-8 justify-center items-center bg-[#fbf5fe]">
        {/* GIF Display */}
        <div className="text-center w-80 flex h-80 justify-center items-center bg- text-gray-600">
          <Image
            src="/cat-spinning.gif"
            alt="App preview coming soon"
            width={200}
            height={200}
            unoptimized
          />
        </div>

        {/* Features List */}
        <section className="max-w-md flex flex-col gap-6 text-[#f0ac4b]">
          <div>
            <h2 className="font-bold mb-2">Tailor Your Study Sessions</h2>
            <p className="p-3 bg-[#f48d77] rounded text-black">
              Customize your workspace with widgets built to boost your focus.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-bold">Tired of Juggling Tabs?</h2>
            <p className="p-3 bg-[#f48d77] rounded text-black">
              Find everything you need in one place, powered by smart tools.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-bold">Zero Ads, Zero Distractions</h2>
            <p className="p-3 bg-[#f48d77] rounded text-black">
              We&apos;re built for students, not ad revenue — goodbye Quizlet
              clutter.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
