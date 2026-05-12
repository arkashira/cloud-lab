import React, { useState } from 'react';
import axios from 'axios';

const AzureServices = () => {
  const [selectedService, setSelectedService] = useState('');
  const [services, setServices] = useState([]);

  const fetchAzureServices = async () => {
    try {
      const response = await axios.get('/api/azure/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching Azure services:', error);
    }
  };

  const handleServiceSelection = (event) => {
    setSelectedService(event.target.value);
  };

  const createResource = async () => {
    try {
      await axios.post('/api/azure/resources', { service: selectedService });
      alert('Resource created successfully!');
    } catch (error) {
      console.error('Error creating Azure resource:', error);
      alert('Failed to create resource.');
    }
  };

  const deleteResource = async () => {
    try {
      await axios.delete(`/api/azure/resources/${selectedService}`);
      alert('Resource deleted successfully!');
    } catch (error) {
      console.error('Error deleting Azure resource:', error);
      alert('Failed to delete resource.');
    }
  };

  return (
    <div>
      <h2>Azure Services</h2>
      <button onClick={fetchAzureServices}>Fetch Services</button>
      <select value={selectedService} onChange={handleServiceSelection}>
        <option value="">Select a service</option>
        {services.map((service) => (
          <option key={service.id} value={service.name}>
            {service.name}
          </option>
        ))}
      </select>
      <button onClick={createResource}>Create Resource</button>
      <button onClick={deleteResource}>Delete Resource</button>
    </div>
  );
};

export default AzureServices;