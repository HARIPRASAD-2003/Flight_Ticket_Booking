// Login.js
import logo from '../../logo-color.png';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.css';

const Login = ({url}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [loginuser, setloginuser] = useState(true);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();

  const UserLogin = async () => {
    try {
      const response = await fetch(url+'/api/login-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if (response.ok) {
        // Handle successful login
        console.log('login successful!');
        // alert('success');
        const data = await response.json();
        const token = data.token;
        // console.log(data);
        // Store the token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('profile', 'user');
        // Reload the page
        window.location.reload();
        // Navigate to the home route after reload
        window.location.href = '/';
      } else {
        // Handle login error
        const errorData = await response.json();
        throw new Error('Login failed: ' + errorData.message);
      }
    } catch (error) {
      alert('userlogin:', error);
    }
  };
  

  const SellerLogin = async() => {
    try {
      const response = await fetch(url+'/api/login-admin',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          // email: email,
          password: password,
        }),
      });
      if (response.ok) {
        // Handle successful signup
        console.log('login successful!');
        alert('success');
        const data = await response.json();
        const token = data.token;
        // Store the token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('admin', JSON.stringify(data.user));
        localStorage.setItem('profile', 'admin');
        // Reload the page
        window.location.reload();
        // Navigate to the home route after reload
        window.location.href = '/';
      } else {
        // Handle signup error
        const errorData = await response.json();
        console.log(errorData)
        throw new Error('login failed:' + errorData.message);
      }
    } catch (error) {
      alert('userlogin:', error);
    }
  }
  const handleUserLogin = (e) => {
    e.preventDefault();
    if (username === '' || password === '') {
      alert("Both fields are required");
      return;
    }
    if(loginuser) UserLogin(); 
    else SellerLogin();
  }

  return (
    <div className='login-page'>
      <div className="login-container">
        <div className="image-container">
          <img src={logo} alt="Login" />
        </div>
        {(loginuser)?<div className="login-form">
          <form onSubmit={(e)=> handleUserLogin(e)}>
            <h2>Login as User</h2>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" placeholder='Username or Email' onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <div className="password-input">
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <span className="eye-icon" onClick={togglePasswordVisibility}>
                  {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                </span>
              </div>
            </div>
            <button type="submit">Login</button>
          <p>Don't have an account? <Link to='/signup' style={{color:'blue', textDecoration:'none'}}>Register now!</Link></p>
          <div onClick={() => setloginuser(false)}>
            <button type='button'>Login as Admin</button>
          </div>
          </form>
        </div>:
        <div className="login-form">
          <form onSubmit={(e)=> handleUserLogin(e)}>
            <h2>Login as Admin</h2>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" placeholder='Username or Email' onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <div className="password-input">
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <span className="eye-icon" onClick={togglePasswordVisibility}>
                  {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                </span>
              </div>
            </div>
            <button type="submit">Login</button>
          <p>Don't have an account? <Link to='/signup' style={{color:'blue', textDecoration:'none'}}>Register now!</Link></p>
          <div onClick={(e) => setloginuser(true)}>
            <button type='button'>Login as User</button>
          </div>
          </form>
        </div>}
        
      </div>
    </div>
  );
};

export default Login;
