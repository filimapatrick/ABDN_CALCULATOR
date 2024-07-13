import React from 'react';
import styles from './Navbar.module.css'; 

const Navbar = () => {
  return (
    <header className={styles.header}>
      <a href="" className={styles.logo}>CSS Nav</a>
      <input className={styles.menuBtn} type="checkbox" id="menu-btn" />
      <label className={styles.menuIcon} htmlFor="menu-btn"><span className={styles.navicon}></span></label>
      <ul className={styles.menu}>
        <li><a href="#Country">Country</a></li>
        <li><a href="#about">Highest Score</a></li>
        <li><a href="#careers">Careers</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </header>
  );
};

export default Navbar;
