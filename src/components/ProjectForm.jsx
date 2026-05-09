import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../store/slices/projectsSlice';

const ProjectForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.projects);

  const [name, setName] = useState('');
  const [iac, setIac] = useState('# Terraform VPC\nresource "aws_vpc" "main" {\n  cidr_block = "10.0.0.0/16"\n}');
  const [visibility, setVisibility] = useState('private');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Project name is required');
      return;
    }
    const project = { name, iac, visibility };
    await dispatch(createProject(project));
    setName('');
    setIac('# Terraform VPC\nresource "aws_vpc" "main" {\n  cidr_block = "10.0.0.0/16"\n}');
    setVisibility('private');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Create New Project</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Project Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Initial IaC Code:
          <textarea
            value={iac}
            onChange={(e) => setIac(e.target.value)}
            rows={10}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Visibility:
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="private">Private</option>
            <option value="shared">Shared</option>
          </select>
        </label>
      </div>
      <button type="submit" disabled={loading} style={{ padding: '0.75rem 1.5rem' }}>
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
};

export default ProjectForm;