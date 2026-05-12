import React from 'react';
import { Link } from 'react-router-dom';

const SupportTickets = () => {
  return (
    <div>
      <h2>Support Tickets</h2>
      <ul>
        <li>
          <Link to="/support/azure">Azure</Link>
        </li>
        {/* Add more ticket categories as needed */}
      </ul>
    </div>
  );
};

export default SupportTickets;