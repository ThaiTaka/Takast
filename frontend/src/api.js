import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchBooks = async (query, topK = 10) => {
  const response = await api.post('/api/books/search', { query, top_k: topK });
  return response.data;
};

export const getBookContent = async (filename) => {
  const response = await api.get(`/api/books/${encodeURIComponent(filename)}`);
  return response.data;
};

export const listBooks = async (page = 1, perPage = 50) => {
  const response = await api.get('/api/books/list', {
    params: { page, per_page: perPage }
  });
  return response.data;
};

export const startTraining = async () => {
  const response = await api.post('/api/training/start');
  return response.data;
};

export const pauseTraining = async () => {
  const response = await api.post('/api/training/pause');
  return response.data;
};

export const getTrainingStatus = async () => {
  const response = await api.get('/api/training/status');
  return response.data;
};

export const synthesizeSpeech = async (text, voice = 'female', speed = 1.0) => {
  const response = await api.post('/api/tts/synthesize', 
    { text, voice, speed },
    { responseType: 'blob' }
  );
  return response.data;
};

export const getAvailableVoices = async () => {
  const response = await api.get('/api/tts/voices');
  return response.data;
};

export const trainTTS = async () => {
  const response = await api.post('/api/tts/train');
  return response.data;
};

export default api;
