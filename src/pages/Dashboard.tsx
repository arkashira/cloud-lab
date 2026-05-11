import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SandboxButton from '../components/SandboxButton';
import { createSandbox } from '../api/sandbox';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sandboxCreated, setSandboxCreated] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateSandbox = async () => {
    try {
      await createSandbox();
      setSandboxCreated(true);
      navigate('/sandbox');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {sandboxCreated ? (
        <p>Sandbox created successfully!</p>
      ) : (
        <SandboxButton onClick={handleCreateSandbox} />
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Dashboard;