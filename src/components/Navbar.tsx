"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

import { Session } from "next-auth";


interface NavbarProps {
  session: string | null;
}

const Navbar = ({session}: NavbarProps) => {
  // const [isSplashPage, setIsSplashPage] = useState(true);
  
  // const path = usePathname();

  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   setIsLoggedIn(!!session?.user);
  // }, [session]);

  // const handleLogout = () => {
  //   logout();
  //   doLogout();
  //   setIsLoggedIn(false);
  // }
  

  // Delete this code if need be
  // useEffect(() => {
  //   setIsSplashPage(path == "/");
  // }, [path]);

  // // Delay Change of navbar (remove this and in the login button, change onClick to handleLogin to see the difference)
  // const [trigger, setTrigger] = useState(false);
  // useEffect(() => {
  //   let interval: string | number | NodeJS.Timeout | undefined;
  //   if (trigger) {
  //     interval = setInterval(() => dispatch({ type: "NEXT_SCREEN" }), 3000);
  //   }
  //   return () => clearInterval(interval);
  // }, [trigger]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <h1 className="font-mono p-3 text-2xl">
          myStudySpace
        </h1>

        <div className={styles.navLinks}>
          {!true ? (
            <Link href="/login">
              <button
                
                className={styles.authButton}
              >
                <h1 className={styles.coolFont}>Login</h1>
              </button>
            </Link>
          ) : !false ? (
            <>
              <Link href="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
              <Link href="/study" className={styles.navLink}>
                Study
              </Link>
              <Link href="/profile" className={styles.navLink}>
                Profile
              </Link>
              <Link href="/add-widget" className={styles.addButton}>
                <FontAwesomeIcon icon={faPlus} />
                Add Widget
              </Link>
              <Link href="/logout">
                <button className={styles.authButton}>
                  <h1 className={styles.coolFont}>Logout</h1>
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/whiteboard" className={`!bg-blue-400 ${styles.authButton}`}>Go To Your Whiteboard</Link>
              <Link href="/logout">
                <button 
                className={styles.authButton}
                >
                  <h1 className={styles.coolFont}>Logout</h1>
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

function dispatch(arg0: { type: string }): void {
  throw new Error("Function not implemented.");
}
