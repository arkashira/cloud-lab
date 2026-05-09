import React, { useState } from 'react';
import projectApi from '../api/projectApi';

const ProjectSettings = () => {
  const [email, setEmail] = useState('');
  const [confirmationLink, setConfirmationLink] = useState('');
  const [projectState, setProjectState] = useState({});

  const handleInvite = async () => {
    try {
      const response = await projectApi.invite(email);
      setConfirmationLink(response.confirmationLink);
    } catch (error) {
      console.error('Error inviting team member:', error);
    }
  };

  const handleUpdateProjectState = async () => {
    try {
      const response = await projectApi.getState();
      setProjectState(response);
    } catch (error) {
      console.error('Error updating project state:', error);
    }
  };

  return (
    <div>
      <h2>Project Settings</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter team member email"
      />
      <button onClick={handleInvite}>Invite</button>
      {confirmationLink && <p>Confirmation link: {confirmationLink}</p>}
      <button onClick={handleUpdateProjectState}>Update Project State</button>
      <pre>Project State: {JSON.stringify(projectState, null, 2)}</pre>
    </div>
  );
};

export default ProjectSettings;