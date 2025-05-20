import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

API.interceptors.request.use(async (config) => {
  const token = await getAuth().currentUser?.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const sendMessageToChatGPT = async (message: string) => {
  const response = await API.post('/chatgpt/message', { message });
  return response.data;
};
