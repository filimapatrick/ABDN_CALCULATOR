// components/WelcomeSection.js
'use client';
import React from 'react';
import { Layout, Button } from 'antd';
import Link from 'next/link';
import styles from '../styles/WelcomeSection.module.css';
import Image from 'next/image';
import abdnLogo from '../../../public/abdnLogo.png'
const { Header, Content, Footer } = Layout;

const WelcomeSection = () => {
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo}>African Brain Data Network</div>
        <div>
<Image src={abdnLogo} className={styles.abdnLogo}/>


        </div>
      </Header>
      
      <Content className={styles.content}>
        <div className={styles.hero}>
          <div className={styles.title}>ABDN 2024 Evaluation</div>
          <div className={styles.subtitle}>Join our second Brain Data Science Program</div>
          <div className={styles.buttonContainer}>
            <Link href='./Calculate'>
              <Button type="primary" className={styles.roleButton}>Evaluator</Button>
            </Link>
            <Link href='./Login'>
              <Button type="default" className={styles.roleButton}>Admin</Button>
            </Link>
          </div>
        </div>
      </Content>
      <Footer className={styles.footer}>
        <p>© 2024 African Brain Data Network. All rights reserved.</p>
      </Footer>
    </Layout>
  );
};

export default WelcomeSection;
