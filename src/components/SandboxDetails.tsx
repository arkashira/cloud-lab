import React from 'react';
import { Sandbox } from '../types'; // Assuming Sandbox type is defined in ../types

interface SandboxDetailsProps {
  sandbox: Sandbox;
}

const SandboxDetails: React.FC<SandboxDetailsProps> = ({ sandbox }) => {
  return (
    <div>
      <h2>Sandbox Details</h2>
      <p><strong>ID:</strong> {sandbox.id}</p>
      <p><strong>Name:</strong> {sandbox.name}</p>
      <p><strong>Status:</strong> {sandbox.status}</p>
      {sandbox.iamRoleArn && (
        <p><strong>IAM Role ARN:</strong> {sandbox.iamRoleArn}</p>
      )}
      {/* Other sandbox details can be added here */}
    </div>
  );
};

export default SandboxDetails;