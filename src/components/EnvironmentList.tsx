import React from 'react';
import { Environment } from '../services/environmentService';

interface EnvironmentListProps {
  environments: Environment[];
  onShareClick?: (env: Environment) => void;
  onNavigate?: (env: Environment) => void;
}

const EnvironmentList: React.FC<EnvironmentListProps> = ({ 
  environments, 
  onShareClick, 
  onNavigate 
}) => {
  if (environments.length === 0) {
    return <p className="text-gray-500">No environments found.</p>;
  }

  return (
    <ul className="environment-list">
      {environments.map((env) => (
        <li key={env.id} className="environment-item">
          <div className="environment-info">
            <strong>{env.name}</strong>
          </div>
          <div className="environment-actions">
            {onNavigate && (
              <button 
                onClick={() => onNavigate(env)} 
                className="btn btn-primary"
              >
                Access
              </button>
            )}
            {onShareClick && (
              <button 
                onClick={() => onShareClick(env)} 
                className="btn btn-secondary"
              >
                Share
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default EnvironmentList;