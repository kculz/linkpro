import api from './api';

export interface Template {
  id: string;
  name: string;
  type: 'LEASE' | 'CONTRACT' | 'QUOTATION' | 'INVOICE' | 'OTHER';
  content: string;
  description?: string;
  createdBy: string;
  createdAt: string;
}

export const getTemplates = async () => {
  const { data } = await api.get('/templates');
  return data.data as Template[];
};

export const createTemplate = async (templateData: Partial<Template>) => {
  const { data } = await api.post('/templates', templateData);
  return data.data as Template;
};

export const seedTemplates = async () => {
  await api.post('/templates/seed');
};

export const deleteTemplate = async (id: string) => {
  await api.delete(`/templates/${id}`);
};
