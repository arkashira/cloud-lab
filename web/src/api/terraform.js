import axios from 'axios';

const terraformApi = {
  getTemplates: async () => {
    const response = await axios.get('/api/terraform/templates');
    return response.data;
  },
  apply: async (template) => {
    const response = await axios.post('/api/terraform/apply', {
      template,
    });
    return response.data;
  },
  destroy: async () => {
    const response = await axios.post('/api/terraform/destroy');
    return response.data;
  },
  getLogs: async () => {
    const response = await axios.get('/api/terraform/logs', { responseType: 'blob' });
    return response.data;
  },
};

export default terraformApi;