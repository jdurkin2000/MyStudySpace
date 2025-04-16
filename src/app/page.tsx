"use client";
import Link from "next/link";
import Image from "next/image";
import connectMongoDB from "../../config/mongodb";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  connectMongoDB();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <Navbar state={false} /> 

      {/* Main Section */}
      <main className="p-8 flex flex-1 flex-col md:flex-row gap-8 justify-center items-center bg-green-600">
        {/* GIF Display */}
        <div className="text-center w-80 flex h-80 justify-center items-center bg-gray-300 text-gray-600">
          <Image
            src="/cat-spinning.gif"
            alt="App preview coming soon"
            width={200}
            height={200}
            unoptimized
          />
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
              We’re built for students, not ad revenue — goodbye Quizlet
              clutter.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
