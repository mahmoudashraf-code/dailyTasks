import axios from 'axios';

export const isTokenStored = () => {
  // Check in sessionStorage
  const token = localStorage.getItem('token'); // Replace 'token' with your actual token key
  if (token) axios.defaults.headers['authorization'] = `Bearer ${token}`;
  return token !== null;
};
