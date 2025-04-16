"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Navbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

type Props = {
  state: boolean;
}

const Navbar: React.FC<Props> = (props) => {
  const { state: loginState } = props;
  // Mock authentication state - in a real app, this would come from your auth provider
  const [isLoggedIn, setIsLoggedIn] = useState(loginState);
  const [isDashboard, setIsDashboard] = useState(false);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  const router = useRouter();
  const handleLogout = () => {
    router.push('/');
  };




  // button to push current data to the database

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>

        <Link href="/" className={styles.navLink}>
          <h1>
          {"{"} myStudySpace {"}"}</h1>
        </Link>
        
        <div className={styles.navLinks}>
          {!isLoggedIn ? (
            <>
            <Link href="/login" className={styles.navLink}>
              <button onClick={handleLogin} className={styles.button}>
                <h1>Login</h1>
              </button>
            </Link>
            </>
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
                <FontAwesomeIcon icon={faPlus}/>
                Add Widget
              </Link>
              <button onClick={handleLogout} className={styles.authButton}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 