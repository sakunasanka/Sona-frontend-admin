import API from './api';

export const feedbackAPI = {
  getAllFeedbacks: (page = 1, limit = 10) => API.get(`/admin/feedbacks?page=${page}&limit=${limit}`),
  getAllComplaints: (page = 1, limit = 10) => API.get(`/admin/complaints?page=${page}&limit=${limit}`),
};