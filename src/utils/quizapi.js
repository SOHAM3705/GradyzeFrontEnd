import API from './api';

export const createTest = (data) => API.post('/create-test', data);
export const getTest = (id) => API.get(`/test/${id}`);
