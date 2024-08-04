
import styles from '../styles/Welcome.module.css';
import { Button } from 'antd';

export default function Welcome() {
  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.backgroundOverlay}></div>
      <h1 className={styles.welcomeText}>Welcome to My Next.js App</h1>
      <p className={styles.description}>Building the future, one line of code at a time.</p>
      <Button type="primary" href='./Steps'>Primary Button</Button>
    </div>
  );
}
