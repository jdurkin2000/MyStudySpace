"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Session } from "next-auth";
import { doLogout } from "@/lib/actions";

interface NavbarProps {
  session: Session | null;
}

const Navbar = ({ session }: NavbarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!session?.user);

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
        <h1 className="font-mono p-3 text-2xl">
          myStudySpace
        </h1>

        {isLoggedIn && <h1>Welcome, {session?.user?.email}!</h1>}

        <div className={styles.navLinks}>
          {!isLoggedIn ? (
            <Link href="/login" className={styles.authButton}>
              <h1 className={styles.coolFont}>Login</h1>
            </Link>
          ) : (
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
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
