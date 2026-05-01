import api from './api';

export const getPortfolioAnalytics = async () => {
  const { data } = await api.get('/analytics/portfolio');
  return data.data;
};
