import axios from './axios';

export const getStations = async () => {
  const response = await axios.get('/stations');
  return response.data;
};

export const getStation = async (id) => {
  const response = await axios.get(`/stations/${id}`);
  return response.data;
};

export const createStation = async (stationData) => {
  const response = await axios.post('/stations', stationData);
  return response.data;
};
