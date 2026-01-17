import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/admin');
    };

    return (
        <header className="page-header">
            <h1 className="page-header__title">
                ИДЁМ<span>В</span>КИНО
            </h1>
            <button className="page-header__login-btn" onClick={handleLogin}>
                Войти
            </button>
        </header>
    );
};

export default Header;