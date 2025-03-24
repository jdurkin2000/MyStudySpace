import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <Link href="/" className={styles.navLink}>
          MyStudySpace
        </Link>
        <div className={styles.navLinks}>
          <Link href="/dashboard" className={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/study" className={styles.navLink}>
            Study
          </Link>
          <Link href="/profile" className={styles.navLink}>
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 