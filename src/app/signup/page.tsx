"use client";
import { doSignup } from "@/lib/actions";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import Image from "next/image";
import styles from "styles/SignupPage.module.css";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loadStyle, setLoadStyle] = useState<string>("absolute");

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loadStyle !== styles.checkmark) {
      setError("Please pet the cat");
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      await doSignup(formData);
      router.push("/");
    } catch (error) {
      console.error(error);
      setError("Something went wrong :(");
    } finally {
      setEmail("");
      setPassword("");
      setLoadStyle("absolute");
    }
  };

  const puppyHandler = () => {
    setLoadStyle(styles.loading);
    setTimeout(() => {
      setLoadStyle(styles.checkmark)
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">
          register to begin studying
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-row gap-2 items-center mb-8">
            <div className={loadStyle} />
            <Image
              src="/cat-still.jpg"
              width={100}
              height={100}
              alt="PUPPPYYYYYYY"
              className={styles.puppy}
              onClick={puppyHandler}
              style={{
                filter: (loadStyle !== "absolute") ? "brightness(50%)" : "",
              }}
            />
            <p className="text-center">
              Verify you are human by petting the cat
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition hover:cursor-pointer"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
