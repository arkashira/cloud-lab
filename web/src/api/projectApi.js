import axios from 'axios';

const projectApi = {
  invite: async (email) => {
    try {
      const response = await axios.post('/api/project/invite', { email });
      return response.data;
    } catch (error) {
      console.error('Error in invite API call:', error);
      throw error; // Re-throw the error so it can be caught by the caller
    }
  },

  getState: async () => {
    try {
      const response = await axios.get('/api/project/state');
      return response.data;
    } catch (error) {
      console.error('Error in getState API call:', error);
      throw error; // Re-throw the error so it can be caught by the caller
    }
  },
};

export default projectApi;