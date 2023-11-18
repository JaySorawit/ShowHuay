import React, { useState } from 'react';
import logo from '../assets/icon/logo.png';
import search from '../assets/icon/search.png';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Navbar() {
    const [isToggled, setIsToggled] = useState(false);

    const handleToggle = () => {
        setIsToggled(!isToggled);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#F44C0C' }}>
            <div className="container" style={{ maxWidth: '1170px' }}>
                <Link className="navbar-brand d-flex align-items-center" style={{ marginLeft: '27px' }} to='/'>
                    <img src={logo} alt="Logo" height="50" />
                    <span className="ms-1 mb-1 nav_logo-span">ShowHuay</span>
                </Link>

                <button
                    className="navbar-toggler toggler-button"
                    type="button"
                    onClick={handleToggle}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse justify-content-between align-items-center ${isToggled ? 'show' : ''}`} id="navbarNav">
                    <div className="d-flex flex-grow-1 justify-content-center align-items-center mt-1 search-bar">
                        <div className="input-group">
                            <input
                                className="form-control py-2 border-end-0 border search-box"
                                type="search"
                                placeholder="Search..."
                                aria-label="Search"
                            />
                            <button className="btn btn-search" type="button">
                                <img src={search} alt="Search" height="20" className="img-search"/>
                            </button>
                        </div>
                    </div>

                    <ul className="navbar-nav mt-2" style={{ marginRight: '27px' }}>
                        <li className="nav-item nav-item2">
                            <Link className="nav-link register-login" to='/Register'>Register</Link>
                        </li>
                        {!isToggled && (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link register-login-sep">|</span>
                                </li>
                            </>
                        )}
                        <li className="nav-item">
                            <Link className="nav-link register-login" to='/LogIn'>Login</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
