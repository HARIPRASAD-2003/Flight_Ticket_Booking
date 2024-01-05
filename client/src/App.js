// import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import LoginPage from './Pages/Auth/LoginPage';
import Signup from './Pages/Auth/Signup'
import LoadingScreen from './Components/LoadingScreen/LoadingScreen';

import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom'
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
function App() {
  const [mode, setMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  // const navigate = useNavigate();
  const Base_URL = "https://flight-server.onrender.com";
  // const Base_URL = "http://localhost:5000";
// 
  const fetchUser = () => {
    if(localStorage.getItem('user')){
      setUser(JSON.parse(localStorage.getItem("user")));
      setProfile('user');
    } else if(localStorage.getItem('admin')){
      setUser(JSON.parse(localStorage.getItem('admin')));
      setProfile('admin');
    } else {
      setUser(null);
      setProfile(null);
    }
  }
  
  useEffect(() => {
    fetchUser();
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 2000);
  }, []);

  return (
    <div className={(mode) ? 'light-mode' : 'dark-mode'}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
      <Router>
        <Navbar mode={mode} setMode={setMode} user={user} url={Base_URL}/>
        <div className='invis'></div>
        <Routes>
          <Route path="/" element={<Home user={user} profile={profile} url={Base_URL}/>}/>
          <Route path="/login" element={<LoginPage url={Base_URL}/>} />
          <Route path="/signup" element={<Signup url={Base_URL}/>} />
          <Route path="/profile" element={<Profile user={user} url={Base_URL}/>}/>
        </Routes>
      </Router>
      )}
      {/* <footer>
        <p>&copy; 2023 TrendHub. All rights reserved.</p>
      </footer> */}

    </div>
  );
}

export default App;
