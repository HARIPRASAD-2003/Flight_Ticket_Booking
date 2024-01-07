import React, { useState, useEffect } from 'react';
import TicketList from './TicketList';
import UserInfo from './UserInfo'; // Create UserInfo component
import './Profile.css'; // Import the CSS file
import ModalCard from '../../Components/Card/ModalCard';

const Profile = ({ user, url, profile }) => {
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const CancelTicket = async() => {
    try {
      const response = await fetch(url + '/api/cancel-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ t_id: selectedTicket.t_id }),
      })
      if(response.ok){
        document.location.reload();
        return;
      } else{
        alert("Failed to cancel the ticket");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const closeModal = () => {
    setShowModal(false);
  }
  
  // Fetch user's tickets from the server
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(url+`/api/user-tickets/${user.user_id}`);
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
      {(user === null) ? (
        <div className="login-message">
          <p>Please log in to view your profile and tickets.</p>
          {/* You can also add a login button or link here */}
        </div>
      ) : (profile ==='admin') ? (
        <div>
          <p>Admin cannot book tickets. Log in as user to book tickets</p>
        </div>
      ) : (
        <div className="profile-container">
          <UserInfo user={user} />
  
          {/* <h3>Your Tickets</h3> */}
          <div className="tickets-section">
            <TicketList tickets={tickets} setShowModal={setShowModal} setSelectedTicket={setSelectedTicket}/>
          </div>
        </div>
      )}
      {showModal && 
        <div className='modal-overlay'>
          <ModalCard CancelTicket={CancelTicket} closeModal={closeModal} ticket={selectedTicket}/>
          {/* <div className='modal-content'>
            <h2>Cancel Ticket</h2>
            <p>
              Are you sure you want to cancel this ticket? <br/>This action cannot be undone.
            </p>
            <div className='buttons'>
              <button onClick={() => CancelTicket()} style={{backgroundColor:'green'}}>Yes</button>
              <button onClick={() => closeModal()} style={{backgroundColor:'red'}}>No</button>
            </div>
          </div> */}
        </div>}
    </div>
  );
  
  
};

export default Profile;
