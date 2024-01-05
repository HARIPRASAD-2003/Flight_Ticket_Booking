import React, { useState, useEffect } from 'react';
import TicketList from './TicketList';
import UserInfo from './UserInfo'; // Create UserInfo component
import './Profile.css'; // Import the CSS file

const Profile = ({ user }) => {
  const [tickets, setTickets] = useState([]);

  // Fetch user's tickets from the server
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user-tickets/${user.user_id}`);
        if (response.ok) {
          const data = await response.json();
          setTickets(data.tickets);
        } else {
          console.error('Failed to fetch tickets');
        }
      } catch (error) {
        console.error('Error fetching tickets', error);
      }
    };

    fetchTickets();
  }, [user?.user_id]);

  return (
    <div>
      {user === null ? (
        <div className="login-message">
          <p>Please log in to view your profile and tickets.</p>
          {/* You can also add a login button or link here */}
        </div>
      ) : (
        <div className="profile-container">
          <UserInfo user={user} />
  
          {/* <h3>Your Tickets</h3> */}
          <div className="tickets-section">
            <TicketList tickets={tickets} />
          </div>
        </div>
      )}
    </div>
  );
  
  
};

export default Profile;
