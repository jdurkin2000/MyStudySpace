"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import connectMongoDB from "../../config/mongodb";
import TextCard from "@/components/TextCard";
import SpinCat from "@/components/SpinCat";

export default function HomePage() {
  connectMongoDB();

  const fullText = "The Future is Widgets_";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  //typing
  useEffect(() => {
    if (index <= fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, index));
        setIndex(index + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <main className="flex flex-col bg-[#fdf4f0] z-0">
      <div className="flex flex-col min-h-screen">
        {/* typing animation */}
        <div className="flex flex-col items-center gap-8 p-15">
          <motion.h1
            className="text-7xl font-mono text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {displayedText}
            {index <= fullText.length && <span className="animate-pulse">_</span>}
          </motion.h1>

          {/* intro button too */}
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-6 p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <section className="max-w-xl">
              <p className="bg-[#e3722b]/50 rounded p-10 text-2xl font-sans text-[#0d0502]">
                With our cutting edge widgets to personalize your StudySpace&trade;, you can
                create a virtual environment that suits your unique study style. Whether you
                need a timer, a note-taking tool, or a distraction blocker, our widgets have
                you covered.
              </p>
            </section>
            <div className="flex justify-center">
              <Link
                href="/signup"
                className="p-3 bg-[#7dee90]/75 rounded font-sans text-2xl hover:scale-105 transition-transform"
              >
                Register and Get Started
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.h1
          className="text-7xl font-mono self-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          Make <b>your</b> StudySpace
        </motion.h1>

        <motion.div
          className="p-8 flex flex-1 flex-col md:flex-row gap-8 justify-center items-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          {/* spinny cat */}
<div className="flex justify-center my-10">
  <SpinCat width={400} height={400} />
</div>

          {/* features */}
          <section className="w-200 flex flex-col gap-6 text-[#0d0502] p-5">
            <motion.div whileHover={{ scale: 1.02 }}>
              <h2 className="font-mono mb-2 text-3xl font-medium">
                Tailor Your Study Sessions
              </h2>
              <p className="p-3 bg-[#7dee90]/75 rounded font-sans text-2xl">
                Customize your workspace with widgets built to boost your focus.
              </p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <h2 className="mb-2 font-mono text-3xl font-medium">
                Tired of Juggling Tabs?
              </h2>
              <p className="p-3 bg-[#7dee90]/75 rounded font-sans text-2xl">
                Find everything you need in one place, powered by smart tools.
              </p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <h2 className="mb-2 font-mono text-3xl font-medium">
                Zero Ads, Zero Distractions
              </h2>
              <p className="p-3 bg-[#7dee90]/75 rounded font-sans text-2xl">
                We&apos;re built for <b>students</b>, not ad revenue — goodbye Quizlet clutter.
              </p>
            </motion.div>
          </section>
        </motion.div>
      </div>

      {/* insights */}
      <motion.div
        className="flex flex-col justify-center items-center z-10 p-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <h1 className="text-5xl z-10 font-mono">Our Founders&apos; Insights</h1>
        <div className="flex flex-row gap-8 mt-10">
          {[
            { title: "Jimmy D.", content: "Adderall. Yes." },
            { title: "Parth M.", content: "*sleep sounds*" },
            { title: "Ariel H.", content: "*flooper noises*" },
            { title: "Maulik D.", content: "*Drowned in his coffee :(*" },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <TextCard title={card.title} content={card.content} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
