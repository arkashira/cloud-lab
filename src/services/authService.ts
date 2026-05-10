import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.axentx.com';

export interface User {
  id: string;
  email: string;
  name: string;
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};