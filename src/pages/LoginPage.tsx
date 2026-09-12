import React, { useState } from 'react';
import axios from 'axios';
import { authApi } from '../Services/BookingApi';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Enter your email and password to continue.');
            return;
        }

        setIsSubmitting(true);

        try {
            await authApi.login({ email: email.trim(), password });
            onLogin();
        } catch (requestError) {
            if (axios.isAxiosError(requestError)) {
                setError(requestError.response?.data?.message ?? 'Unable to sign in. Check your details and try again.');
            } else if (requestError instanceof Error) {
                setError(requestError.message);
            } else {
                setError('Unable to sign in. Try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-panel">
                <div className="login-brand-mark">SH</div>
                <p className="login-kicker">ServiceHub admin</p>
                <h1>Welcome back</h1>
                <p className="login-copy">Sign in to manage bookings, providers, and customers.</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="login-field">
                        <span>Email address</span>
                        <input
                            className="input"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="admin@example.com"
                            autoComplete="email"
                            required
                        />
                    </label>

                    <label className="login-field">
                        <span>Password</span>
                        <input
                            className="input"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    {error && <p className="login-error" role="alert">{error}</p>}

                    <button className="btn btn-primary login-submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </section>
        </main>
    );
};

export default LoginPage;