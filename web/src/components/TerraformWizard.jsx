import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TerraformWizard = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [applyStatus, setApplyStatus] = useState(null);
  const [logs, setLogs] = useState(null);

  useEffect(() => {
    axios.get('/api/terraform/templates')
      .then(response => {
        setTemplates(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleApply = () => {
    axios.post('/api/terraform/apply', {
      template: selectedTemplate,
    })
      .then(response => {
        setApplyStatus(response.data.status);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleDestroy = () => {
    axios.post('/api/terraform/destroy')
      .then(response => {
        setApplyStatus(null);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleLogDownload = () => {
    axios.get('/api/terraform/logs', { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'terraform-logs.log';
        a.click();
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Terraform Wizard</h1>
      <select value={selectedTemplate} onChange={(e) => handleTemplateSelect(e.target.value)}>
        <option value="">Select a template</option>
        {templates.map((template) => (
          <option key={template.name} value={template.name}>{template.name}</option>
        ))}
      </select>
      <button onClick={handleApply}>Apply</button>
      {applyStatus && (
        <div>
          <p>Apply status: {applyStatus}</p>
          <button onClick={handleDestroy}>Destroy</button>
          <button onClick={handleLogDownload}>Download logs</button>
        </div>
      )}
    </div>
  );
};

export default TerraformWizard;