import axios from 'axios';

// Base URL for the API
export const BASE_URL = 'https://67b0320fdffcd88a67889a78.mockapi.io/api';

// Function to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Function to handle API errors
const handleApiError = (error) => {
  throw new Error('An error occurred while communicating with the API');
};

// Function to make a GET request
export const _fetch = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to make a POST request
export const _create = async (endpoint, postData) => {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, postData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to make a PUT request with dynamic ID and update data
export const _update = async (endpoint, id, updateData) => {
  try {
    const url = `${BASE_URL}${endpoint.replace(':id', id)}`;

    const response = await axios.put(url, updateData, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to make a DELETE request with dynamic ID
export const _delete = async (endpoint, id) => {
  try {
    const url = `${BASE_URL}${endpoint.replace(':id', id)}`;

    const response = await axios.delete(url, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
