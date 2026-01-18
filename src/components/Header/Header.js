import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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
                        <Link to="/" className="page-header__title">
                            Идём<span className="page-header__title-thin">в</span>кино
                        </Link>

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