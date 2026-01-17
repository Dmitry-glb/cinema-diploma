import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = location.pathname.includes('admin');

    const isLoginPage = location.pathname === '/login';

    return (
        <header className="page-header">
            <div className="wrapper">
                <div className="page-header__content">

                    <div className="page-header__logo-wrapper">
                        <a href="/" className="page-header__title">
                            Идём<span className="page-header__title-thin">в</span>кино
                        </a>

                        {isAdmin && (
                            <span className="page-header__subtitle">Администраторррская</span>
                        )}
                    </div>

                    {!isAdmin && !isLoginPage && (
                        <button className="page-header__login-btn" onClick={() => navigate('/login')}>
                            Войти
                        </button>
                    )}

                </div>
            </div>
        </header>
    );
};

export default Header;