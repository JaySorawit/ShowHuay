import React from 'react';
import logo from '../assets/icon/logo.png';
import search from '../assets/icon/search.png';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
        <div className="container">
            <div className="nav_logo">
                <Link to='/'><img src={logo} alt="Logo" /></Link>
                <Link to='/'><p>ShowHuay</p></Link>
            </div>
            <div className="navSearch">
                <input type="text" placeholder="Search..."/>
                <div className="navbutton">
                    <button type="button">
                        <img src={search} />
                    </button>
                </div>
            </div>
            <div className="regislogin">
                <Link to='/Register'>Register</Link>
                <p>|</p>
                <Link to='/LogIn'>LogIn</Link>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;