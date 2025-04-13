"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Navbar.module.css';

const Navbar: React.FC = () => {
  // Mock authentication state - in a real app, this would come from your auth provider
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <Link href="/" className={styles.navLink}>
          MyStudySpace
        </Link>
        <div className={styles.navLinks}>
          {isLoggedIn ? (
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
              <button onClick={handleLogout} className={styles.authButton}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={handleLogin} className={styles.authButton}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 