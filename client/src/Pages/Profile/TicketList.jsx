import React, {useState}from 'react';
import './TicketList.css';

import Card from '../../Components/Card/Card';
const TicketCard = ({ ticket, setShowModal,  setSelectedTicket}) => {
  const handleCancelClick = () => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  

  

  return (
    <div className="ticket-card">
      <h3>Ticket Details</h3>
      <p>
        <strong>Name:</strong> {ticket.name}
      </p>
      <p>
        <strong>Age:</strong> {ticket.age}
      </p>
      <p>
        <strong>Flight Name:</strong> {ticket.f_name}
      </p>
      <p>
        <strong>From:</strong> {ticket.f_from}
      </p>
      <p>
        <strong>To:</strong> {ticket.f_to}
      </p>
      <p>
        <strong>Date:</strong>{' '}
        {new Date(ticket.f_date).toLocaleDateString('en-GB', {
          month: 'long',
          day: '2-digit',
          year: 'numeric',
        })}   
      </p>
        {(ticket.stat==='Active') ? 
        <button onClick={handleCancelClick} style={{backgroundColor:'red'}}>Cancel Ticket</button> : 
        <button style={{backgroundColor:'gray'}}>Cancelled</button>}
      </div>  
  );
};

const TicketList = ({ tickets, setShowModal, setSelectedTicket }) => {
  
  return (
    <div className="ticket">
      <h2>Your Tickets</h2>
      <div className="ticket-list">
        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <Card key={index} ticket={ticket} setShowModal={setShowModal} setSelectedTicket={setSelectedTicket}/>
          ))
        ) : (
          <p>No tickets available</p>
        )}
      </div>
    </div>
  );
};

export default TicketList;
