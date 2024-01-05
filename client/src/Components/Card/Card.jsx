// Card.js

import React from 'react';
import './Card.css';

const Card = ({ ticket }) => {
  return (
    <div className="card">
      {/* <img src={product.image} alt={product.title} /> */}
      <div className="card-content">
        <h3 className="card-name">{ticket.name}</h3>
        <p className="card-age">{ticket.age}</p>
      </div>
    </div>
  );
};

export default Card;
