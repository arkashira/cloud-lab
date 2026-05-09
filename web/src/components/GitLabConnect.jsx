import React, { useState } from 'react';
import axios from 'axios';
import { gitlabApi } from '../api/gitlabApi';

const GitLabConnect = () => {
  const [accessToken, setAccessToken] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [connected, setConnected] = useState(false);

  const handleOAuth = async () => {
    try {
      const response = await gitlabApi.getOAuthToken();
      setAccessToken(response.data.access_token);
      setConnected(true);
    } catch (error) {
      console.error('Failed to get OAuth token:', error);
    }
  };

  const handleRepoConnection = async () => {
    try {
      await gitlabApi.connectRepository(accessToken, repoUrl);
      setConnected(true);
    } catch (error) {
      console.error('Failed to connect repository:', error);
    }
  };

  return (
    <div>
      <h2>Connect GitLab Repository</h2>
      {!connected && (
        <>
          <button onClick={handleOAuth}>Connect via OAuth</button>
          <input
            type="text"
            placeholder="Enter GitLab Repo URL"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
          <button onClick={handleRepoConnection}>Connect Repository</button>
        </>
      )}
      {connected && <p>Repository connected successfully!</p>}
    </div>
  );
};

export default GitLabConnect;