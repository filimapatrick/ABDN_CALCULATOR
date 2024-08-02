'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/LoginForm.module.css'; // Import the CSS module

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Logging in with:', username, password);

        // Simulate login logic (replace with actual authentication logic)
        if (username === 'ABDN' && password === '2024') {
            console.log('Login successful! Redirecting...');
            router.push('/Header'); // Redirect to the Result page after successful login
        } else {
            console.log('Invalid username or password');
            alert('Invalid username or password');
        }
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleLogin} className={styles.form}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputField}
                />
                <button type="submit" className={styles.button}>Login</button>
            </form>
        </div>
    );
}

export default LoginForm;
