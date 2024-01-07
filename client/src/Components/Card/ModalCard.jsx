import React from 'react';
import './ModalCard.css';
import Card from './Card';
const ModalCard = ({CancelTicket=()=>{}, closeModal=()=>{}, ticket={}}) => {
  return (
    <div className="card2">
      <div className="header2">
        <div className="image2">
          <svg
            aria-hidden="true"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              strokeLinejoin="round"
              strokeLinecap="round"
            ></path>
          </svg>
        </div>
        <div className="content2">
          <span className="title2">Cancel Your Ticket</span>
          <p className="message2">
            Are you sure you want to Cancel your Ticket? This action cannot be undone.
          </p>
          <p>Ticket Details:</p>
          {/* <p>{new Date(ticket.f_date).toLocaleDateString('en-GB', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        })}</p>
                  <p>Flight Name: {ticket.f_name}</p>
          <p>Passenger: {ticket.name} <br />Age: {ticket.age}</p>
          <p>From: {ticket.f_from} <br />To: {ticket.f_to}</p> */}
          <div className='ticket-list'>
          <Card ticket={ticket}/>
          </div>
        </div>
        <div className="actions2">
          <button className="desactivate2" type="button" onClick={() => CancelTicket()}>
            Yes
          </button>
          <button className="cancel2" type="button" onClick={() => closeModal()}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCard;
