import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ userId, role }) {
  return (
    <div>
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/opportunities">Opportunities</Link></li>
          <li><Link to="/applications">Applications</Link></li>
          <li><Link to="/messaging">Messaging</Link></li>
          <li><Link to="/notifications">Notifications</Link></li>
          {role === 'admin' && <li><Link to="/admin">Admin Panel</Link></li>}
        </ul>
      </nav>
      <div>Welcome to your dashboard!</div>
    </div>
  );
}

export default Dashboard;

