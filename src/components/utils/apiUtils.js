import axios from 'axios';

// Base URL for the API
export const BASE_URL = 'https://localkonnectbackend.onrender.com';

// Function to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Function to handle API errors
const handleApiError = (error) => {
  //   console.error('API Error:', error?.response?.data || error.message);
  throw new Error('An error occurred while communicating with the API');
};

// Function to make a GET request
export const _fetch = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
      params,
    });
    console.log(response);
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
    console.log(response);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to make a PUT request
export const _update = async (endpoint, updateData) => {
  try {
    const response = await axios.put(`${BASE_URL}${endpoint}`, updateData, {
      headers: getAuthHeaders(),
    });
    console.log(response);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to make a DELETE request
export const _delete = async (endpoint) => {
  try {
    const response = await axios.delete(`${BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
    });
    console.log(response);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
