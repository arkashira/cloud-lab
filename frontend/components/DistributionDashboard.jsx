import React, { useState } from 'react';

const DistributionDashboard = ({ distributions }) => {
  const [filter, setFilter] = useState('all');

  const filteredDistributions = distributions.filter(distribution => {
    return filter === 'all' || distribution.status === filter;
  });

  return (
    <div>
      <h1>Distribution Dashboard</h1>
      <label>
        Filter by status:
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="failed">Failed</option>
        </select>
      </label>
      <ul>
        {filteredDistributions.map((distribution) => (
          <li key={distribution.id}>
            <h2>{distribution.name}</h2>
            <p>Status: {distribution.status}</p>
            <p>Created on: {new Date(distribution.creationDate).toLocaleDateString()}</p>
            <p>Metrics: {JSON.stringify(distribution.metrics)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DistributionDashboard;