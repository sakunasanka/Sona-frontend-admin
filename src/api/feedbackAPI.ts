import API from './api';

export const feedbackAPI = {
  getAllFeedbacks: (page = 1, limit = 10) => API.get(`/admin/feedbacks?page=${page}&limit=${limit}`),
};