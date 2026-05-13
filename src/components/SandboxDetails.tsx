import React from 'react';
import { Sandbox } from '../types';

interface SandboxDetailsProps {
  sandbox: Sandbox;
}

const SandboxDetails: React.FC<SandboxDetailsProps> = ({ sandbox }) => {
  return (
    <div className="sandbox-details">
      <h2>Sandbox Details</h2>
      <dl>
        <dt>ID:</dt>
        <dd>{sandbox.id}</dd>

        <dt>Name:</dt>
        <dd>{sandbox.name}</dd>

        <dt>Status:</dt>
        <dd>{sandbox.status}</dd>

        {sandbox.iamRoleArn && (
          <>
            <dt>IAM Role ARN:</dt>
            <dd>{sandbox.iamRoleArn}</dd>
          </>
        )}
      </dl>
    </div>
  );
};

export default SandboxDetails;