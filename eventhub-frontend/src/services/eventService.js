import axios from 'axios';

const API_URL = '/api/events';

// Helper to get token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getEvents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getEventById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const getOrganizerEvents = async () => {
  const response = await axios.get(`${API_URL}/organizer/my-events`, getAuthHeader());
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await axios.post(API_URL, eventData, getAuthHeader());
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await axios.put(`${API_URL}/${id}`, eventData, getAuthHeader());
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  return response.data;
};
