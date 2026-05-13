import React from 'react';
import axios from 'axios';

const SandboxLogs = ({ sandboxId }) => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`/api/sandboxes/${sandboxId}/logs`);
      setLogs(response.data.logs);
    } catch (error) {
      console.error('Failed to fetch sandbox logs:', error);
    }
  };

  React.useEffect(() => {
    fetchLogs();
  }, [sandboxId]);

  return (
    <div>
      <h3>Sandbox Provisioning Logs</h3>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default SandboxLogs;