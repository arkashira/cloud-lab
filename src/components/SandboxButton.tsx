import React from 'react';

interface SandboxButtonProps {
  onClick: () => void;
}

const SandboxButton: React.FC<SandboxButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      Create Sandbox
    </button>
  );
};

export default SandboxButton;