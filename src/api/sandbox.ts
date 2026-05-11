import axios from 'axios';

const createSandbox = async () => {
  try {
    const response = await axios.post('/api/create-sandbox', {
      // Sandbox creation data
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { createSandbox };