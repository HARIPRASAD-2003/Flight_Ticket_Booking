import React from 'react';
import './TicketList.css';

const TicketCard = ({ ticket, onCancelTicket }) => {
  const handleCancelClick = () => {
    // Pass the ticket ID or any other necessary information to the onCancelTicket function
    // onCancelTicket(ticket.t_id);
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
      <button onClick={handleCancelClick}>Cancel Ticket</button>
    </div>
  );
};

const TicketList = ({ tickets, onCancelTicket }) => {
  return (
    <div className="ticket">
      <h2>Your Tickets</h2>
      <div className="ticket-list">
        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <TicketCard key={index} ticket={ticket} onCancelTicket={onCancelTicket} />
          ))
        ) : (
          <p>No tickets available</p>
        )}
      </div>
    </div>
  );
};

export default TicketList;
