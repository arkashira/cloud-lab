import axios from 'axios';

// Define interfaces for better type safety
interface Environment {
  id: string;
  name: string;
  // Add other relevant fields like status, created_at, etc.
}

interface ShareRequest {
  environmentId: string;
  recipientEmail: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'https://api.axentx.com';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export const getSharedEnvironments = async (userId: string): Promise<Environment[]> => {
  try {
    const response = await api.get(`/environments/shared`, { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching shared environments:', error);
    return [];
  }
};

export const getUserEnvironments = async (userId: string): Promise<Environment[]> => {
  try {
    const response = await api.get(`/environments/user`, { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching user environments:', error);
    return [];
  }
};

export const shareEnvironment = async (data: ShareRequest): Promise<void> => {
  try {
    await api.post('/environments/share', data);
  } catch (error) {
    console.error('Error sharing environment:', error);
    throw error;
  }
};