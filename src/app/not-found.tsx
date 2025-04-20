
"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col bg-[#fdf4f0] z-0">
      <div className="flex flex-col min-h-screen">
        {/* title and message */}
        <div className="flex flex-col items-center gap-8 p-15">
          <h1 className="text-7xl font-mono">404 – Page Not Found</h1>
          <section className="w-200 p-10">
            <p className="bg-[#e3722b]/50 rounded p-10 text-2xl font-sans text-center">
              We can’t find the page you’re looking for :(
            </p>
          </section>
        </div>

        {/* cat gif  */}
        <div className="self-center text-center w-80 flex justify-center items-center text-[#0d0502]">
          <Image
            src="/cat-spinning.gif"
            alt="Lost cat"
            width={200}
            height={200}
            unoptimized
          />
        </div>

        {/* home button yupo */}
        <div className="flex justify-center p-8">
          <Link
            href="/"
            className="p-3 bg-[#7dee90]/75 rounded font-sans text-2xl"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}
