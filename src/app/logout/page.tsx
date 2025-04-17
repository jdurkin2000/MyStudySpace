import React from "react";
import Link from "next/link"; // or next/link depending on your setup

const LogoutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">You&apos;ve been logged out</h1>
        <p className="text-gray-600 mb-6">
          Thank you for visiting. We hope to see you again soon!
        </p>
        <div className="flex flex-col items-center space-y-4">
            <Link
            href="/login"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
            Log back in
            </Link>
            
            <Link href="/" className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                Go back to landing page
            </Link>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
