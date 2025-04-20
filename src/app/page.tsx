"use client";
import Image from "next/image";
import connectMongoDB from "../../config/mongodb";

import TextCard from "@/components/TextCard";

export default function HomePage() {
  connectMongoDB();

  return (
    <main className="flex flex-col bg-[#fdf4f0] z-0">
      <div className="flex flex-col min-h-screen">
        {/* The Future is Widgets */}
        <div className="flex flex-col items-center gap-8 p-15">
          <h1 className="text-7xl font-mono">The Future is Widgets</h1>
          <section className="w-200 p-10">
            <p className="bg-[#e3722b]/50 rounded p-10 text-2xl font-sans">
              With our cutting edge widgets to personalize your
              StudySpace&trade;, you can create a virtual environment that suits
              your unique study style. Whether you need a timer, a note-taking
              tool, or a distraction blocker, our widgets have you covered.
            </p>
          </section>
        </div>
        {/* Main Section */}
        <h1 className="text-7xl font-mono self-center">
          Make <b>your</b> StudySpace
        </h1>
        <div className="p-8 flex flex-1 flex-col md:flex-row gap-8 justify-center items-center relative z-10">
          {/* GIF Display */}
          <div className="text-center w-80 flex h-80 justify-center items-center text-[#0d0502]">
            <Image
              src="/cat-spinning.gif"
              alt="App preview coming soon"
              width={200}
              height={200}
              unoptimized
            />
          </div>

          {/* Features List */}
          <section className="w-200 flex flex-col gap-6 text-[#0d0502] p-5">
            <div>
              <h2 className="font-mono mb-2 text-3xl font-medium">
                Tailor Your Study Sessions
              </h2>
              <p className="p-3 bg-[#7dee90]/75 rounded font-sans text-2xl">
                Customize your workspace with widgets built to boost your focus.
              </p>
            </div>
            <div>
              <h2 className="mb-2 font-mono text-3xl font-medium">
                Tired of Juggling Tabs?
              </h2>
              <p className="p-3 bg-[#7dee90]/75 rounded font-sans text-2xl">
                Find everything you need in one place, powered by smart tools.
              </p>
            </div>
            <div>
              <h2 className="mb-2 font-mono text-3xl font-medium">
                Zero Ads, Zero Distractions
              </h2>
              <p className="p-3 bg-[#7dee90]/75 rounded font-sans text-2xl">
                We&apos;re built for <b>students</b>, not ad revenue — goodbye
                Quizlet clutter.
              </p>
            </div>
          </section>
        </div>
      </div>{" "}
      {/* End of Feature List */}
      {/* Our Founders' Insights */}
      <div className="flex flex-col justify-center items-center z-10 p-24">
        {/* Little Spiel */}
        <h1 className="text-5xl z-10 font-mono">Our Founders&apos; Insights</h1>
        <div className="flex flex-row gap-8">
          <TextCard title="Jimmy D." content="Adderall. Yes." />
          <TextCard title="Parth M." content="*sleep sounds*" />
          <TextCard title="Ariel H." content="*flooper noises*" />
          <TextCard title="Maulik D." content="*Drowned in his coffee :(*" />
        </div>
      </div>
    </main>
  );
}
