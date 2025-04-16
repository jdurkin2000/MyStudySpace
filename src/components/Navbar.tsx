"use client";

import React, { useEffect, useState } from 'react';
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

  // Delay Change of navbar (remove this and in the login button, change onClick to handleLogin to see the difference)
  const [trigger, setTrigger] = useState(false);
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (trigger) {
      interval = setInterval(() => dispatch({ type: "NEXT_SCREEN" }), 3000);
    }
    return () => clearInterval(interval);
  }, [trigger]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>

        <h1 className={styles.coolFont}>
          {"{"} myStudySpace {"}"}
        </h1>
        
        <div className={styles.navLinks}>
          {!isLoggedIn ? (
            <>
            <Link href="/login">
              <button onClick={() => setTrigger(true)} className={styles.authButton}>
                <h1 className={styles.coolFont}>Login</h1>
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
              <Link href="/logout">
                <button onClick={handleLogout} className={styles.authButton}>
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

function dispatch(arg0: { type: string; }): void {
  throw new Error('Function not implemented.');
}
