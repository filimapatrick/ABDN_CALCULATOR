// components/WelcomeSection.js
'use client'
import { useEffect } from 'react';
import styles from '../styles/WelcomeSection.module.css';
import Link from 'next/link';

const WelcomeSection = () => {
  useEffect(() => {
    const divs = document.getElementById('welcome').getElementsByTagName('div');
    for (let i = 0; i < divs.length; i++) {
      divs[i].onclick = splitScreen;
    }

    function splitScreen() {
      document.getElementById('welcome').style.visibility = 'hidden';
      const split = document.getElementById('Of');
      if (true) {
        split.className = 'On';
        divs[0].className = 'Of';
        divs[1].className = 'Of';
      }
    }
  }, []);

  return (
    <>
      <section id='welcome' className={styles.welcome}>
        <div id='left' className={styles.left}>WELCOME {''}ABDN</div>
        <span id='Of' className={styles.Of}></span>
        <div id='right' className={styles.right}> EVALUATOR!</div>
      </section>
     
     
     
      <div id='lorem' className={styles.lorem}>
        <div className={styles.container}>
           <p>please! specify your role.</p>
        <div className={styles.buttonContainer}>
        <Link href='./Calculate'> <button className={styles.roleButton}>Evaluator</button></Link>  
        <Link href='./Login'>   <button className={styles.roleButton}>Admin</button></Link>
        </div>
        </div>

      </div>
    </>
  );
};

export default WelcomeSection;
