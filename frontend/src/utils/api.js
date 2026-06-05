import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const getErrorMessage = (error, fallbackMessage) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.message === 'Network Error') {
    return 'Cannot reach the ThinkVault backend. Make sure the backend server is running on port 8001.';
  }
  return fallbackMessage;
};

export const uploadFiles = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await api.post('/api/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw new Error(
      getErrorMessage(error, 'Upload failed. Please check the file type and try again.')
    );
  }
};

export const sendMessage = async (message, history, filesContext, signal) => {
  try {
    const response = await api.post('/api/chat/', {
      message,
      history,
      files_context: filesContext,
    }, { signal });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error(
      getErrorMessage(error, 'ThinkVault could not answer right now. Please try again.')
    );
  }
};

export default api;
