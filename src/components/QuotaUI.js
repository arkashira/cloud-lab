import React, { useState } from 'react';

const QuotaUI = () => {
  const [formData, setFormData] = useState({ name: '', value: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add your API call here
      console.log('Submitting quota update:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Failed to update quota:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="name" 
        value={formData.name} 
        onChange={handleChange} 
        disabled={isSubmitting}
      />
      <input 
        type="number" 
        name="value" 
        value={formData.value} 
        onChange={handleChange}
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update Quota'}
      </button>
    </form>
  );
};

export default QuotaUI;