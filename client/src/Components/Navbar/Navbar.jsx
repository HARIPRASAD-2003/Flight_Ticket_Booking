import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import logo from '../../logo-color.png';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import "./Navbar.css"

const Navbar = ({ mode, setMode, user }) => {
  const navigate = useNavigate();
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const handleAvatarClick = () => {
    setPopoverOpen(!isPopoverOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    // navigate('/');
    window.location.reload();
    window.location.href = '/';
  };

  return (
    <nav className='navbar'>
      <div className='logo'>
        <Link to="/"><img src={logo} alt='' /></Link>
      </div>
      <div className='links'>
        {(user == null) ? 
          <div className='login-signup'>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
          </div> : 
          <div className='user-popover'>
            <div className='avatar' onClick={handleAvatarClick}>
              <FaUserCircle />
            </div>
            {isPopoverOpen && (
              <div className='popover-content'>
                <div onClick={() => {navigate('/profile'); handleAvatarClick()}}>Profile</div>
                <div onClick={() => handleLogout()}>Logout</div>
              </div>
            )}
          </div>
        }
        <div className='mode-toggle' onClick={() => setMode(!mode)}>
          {mode ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
