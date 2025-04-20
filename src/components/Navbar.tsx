"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Session } from "next-auth";
import { doLogout } from "@/lib/actions";
import { usePathname } from "next/navigation";

interface NavbarProps {
  session: Session | null;
}

const Navbar = ({ session }: NavbarProps) => {
  const pathname = usePathname();
  const [path, setPath] = useState(pathname);
  const [isLoggedIn, setIsLoggedIn] = useState(!!session?.user);

  useEffect(() => {
    setPath(pathname);
    console.log("Path changed to: ", pathname);
  }, [pathname]);

  useEffect(() => {
    setIsLoggedIn(!!session?.user);
  }, [session]);

  const handleLogout = () => {
    doLogout();
    setIsLoggedIn(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
      <div className="flex items-center">
  <img 
    //the cat is the logo
    src="/cat-spinning.gif" 
    alt="Spinning Cat Logo"
    className="h-10 mr-2 object-contain"
  />
  <h1 className="font-mono p-3 text-2xl">myStudySpace</h1>
</div>

        {isLoggedIn && <h1>Welcome, {session?.user?.email}!</h1>}

        <div className={styles.navLinks}>
          {path === "/login" || path === "/signup" ? (
            <Link href="/" className={styles.navLink}>
            Home
            </Link>
          ) : !isLoggedIn ? (
            <>
              <Link href="/login" className={styles.authButton}>
                <h1 className={styles.coolFont}>Login</h1>
              </Link>
              <Link href="/signup" className={styles.authButton}>
                <h1 className={styles.coolFont}>Register</h1>
              </Link>
            </>
          ) : path === "/whiteboard" ? (
            <>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
              <Link href="/add-widget" className={styles.addButton}>
                <FontAwesomeIcon icon={faPlus} />
                Add Widget
              </Link>
              <Link href="/logout" onClick={handleLogout}>
                <button className={styles.authButton}>
                  <h1 className={styles.coolFont}>Logout</h1>
                </button>
              </Link>
            </>
          ) : path === "/" ? (
            <>
              <Link href="/whiteboard" className={styles.navLink}>
                Whiteboard
              </Link>
              <Link href="/logout" onClick={handleLogout}>
                <button className={styles.authButton}>
                  <h1 className={styles.coolFont}>Logout</h1>
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
              <Link href="/logout" onClick={handleLogout}>
                <button className={styles.authButton}>
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
