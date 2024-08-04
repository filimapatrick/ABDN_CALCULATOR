'use client';
import { useState } from 'react';
import { Button, Input, Form } from 'antd';
import styles from '../styles/LoginForm.module.css';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Logging in with:', username, password);

       
        if (username === 'ABDN' && password === '2024') {
            console.log('Login successful! Redirecting...');
            router.push('/Header');
        } else {
            console.log('Invalid username or password');
            alert('Invalid username or password');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.signin_container}>
                    <h1 className={styles.title}>Sign In</h1>
                    <Form style={{ width: '100%' }} onSubmit={handleLogin}>
                        <Form.Item>
                            <Input
                                className={styles.input}
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                type="password"
                                placeholder="Password"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={handleLogin}
                            className={styles.submit}
                        >
                            Sign In
                        </Button>
                    </Form>
                </div>
                <div className={styles.signup_container}>
                    <h1 className={styles.title}>Hello, Friend!</h1>
                    <p>Enter the details and start your journey with us</p>
                </div>
            </div>
        </div>
    );
}
