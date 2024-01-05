// UserInfo.js
import React from 'react';

const UserInfo = ({ user }) => {
  return (
    <div className="user-info">
      <h2>Welcome, {user.username}!</h2>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserInfo;
