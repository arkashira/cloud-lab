import React, { useState, useEffect } from 'react';
import DistributionDashboard from '../components/DistributionDashboard';

const DashboardPage = () => {
  const [distributions, setDistributions] = useState([]);

  useEffect(() => {
    // Fetch distributions from an API or data source
    const fetchDistributions = async () => {
      try {
        const response = await fetch('/api/distributions');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDistributions(data);
      } catch (error) {
        console.error('Failed to fetch distributions:', error);
      }
    };

    fetchDistributions();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <DistributionDashboard distributions={distributions} />
    </div>
  );
};

export default DashboardPage;