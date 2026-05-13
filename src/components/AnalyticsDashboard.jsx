import React, { useState, useEffect } from 'react';

const AnalyticsDashboard = () => {
  const [launchData, setLaunchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLaunchData = async () => {
      try {
        // Simulate API call to get launch counts for last 30 days
        // In a real implementation, this would be an actual API endpoint
        const response = await fetch('/api/analytics/template-launches');
        
        if (!response.ok) {
          throw new Error('Failed to fetch launch data');
        }
        
        const data = await response.json();
        setLaunchData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLaunchData();
    
    // Set up hourly refresh interval
    const interval = setInterval(fetchLaunchData, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <h2>Template Launch Analytics</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-dashboard">
        <h2>Template Launch Analytics</h2>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <h2>Template Launch Analytics</h2>
      <p>Last 30 days</p>
      <div className="launch-data-grid">
        {launchData.map((template) => (
          <div key={template.templateId} className="template-card">
            <h3>{template.templateName}</h3>
            <p className="launch-count">{template.launchCount} launches</p>
            <p className="last-updated">Last updated: {template.lastUpdated}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;