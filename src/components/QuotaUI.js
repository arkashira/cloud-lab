import React, { useState } from 'react';

const QuotaUI = ({ workspaceId }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fixed: Use different variable names to avoid shadowing
  const handleChange = (event) => {
    const { name: inputName, value: inputValue } = event.target;
    
    if (inputName === 'name') {
      setName(inputValue);
    } else if (inputName === 'value') {
      setValue(inputValue);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/${workspaceId}/quota`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, value: parseInt(value, 10) },
      });

      if (!response.ok) {
        throw new Error('Failed to update quota');
      }

      const result = await response.json();
      console.log('Quota updated:', result);
      
      // Reset form after successful update
      setName('');
      setValue('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="text"
        name="name"
        value={name}
        onChange={handleChange}
        placeholder="Quota name"
        disabled={isLoading}
      />
      
      <input
        type="number"
        name="value"
        value={value}
        onChange={handleChange}
        placeholder="Quota value"
        disabled={isLoading}
      />
      
      <button type="submit" disabled={isLoading || !name || !value}>
        {isLoading ? 'Updating...' : 'Update Quota'}
      </button>
    </form>
  );
};

export default QuotaUI;