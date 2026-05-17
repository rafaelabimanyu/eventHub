import axios from 'axios';

const API_URL = '/api/tickets';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const bookTicket = async (eventId) => {
  const response = await axios.post(`${API_URL}/book`, { eventId }, getAuthHeader());
  return response.data;
};

export const checkRegistration = async (eventId) => {
  const response = await axios.get(`${API_URL}/check/${eventId}`, getAuthHeader());
  return response.data;
};

export const getMyTickets = async () => {
  const response = await axios.get(`${API_URL}/my-tickets`, getAuthHeader());
  return response.data;
};

export const checkInTicket = async (ticketId) => {
  const response = await axios.put(`${API_URL}/check-in/${ticketId}`, {}, getAuthHeader());
  return response.data;
};
