import React, { useState, useEffect } from 'react';
import { request } from '../../../api';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        document.body.classList.add('admin-body-bg');
        return () => {
            document.body.classList.remove('admin-body-bg');
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        const body = new FormData();
        body.set('login', email);
        body.set('password', password);

        request('login', 'POST', body).then(data => {
            if (data.result) {
                localStorage.setItem('isAuth', 'true');
                onLogin();
            } else {
                setError('Ошибка авторизации');
            }
        });
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h2>Авторизация</h2>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="email">E-mail</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="example@domain.xyz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-field">
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <div className="login-actions">
                        <button type="submit" className="login-btn">Авторизоваться</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;