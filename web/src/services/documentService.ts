import api from './api';

export interface Document {
  id: string;
  name: string;
  type: 'LEASE' | 'RECEIPT' | 'BLUEPRINT' | 'ID' | 'CONTRACT' | 'OTHER';
  fileUrl: string;
  fileType: string;
  fileSize: number;
  targetId?: string;
  targetType: 'PROPERTY' | 'PROJECT' | 'TENANT' | 'UNIT' | 'TRANSACTION' | 'GENERAL';
  uploadedBy: string;
  createdAt: string;
  uploader?: { name: string };
}

export const getDocuments = async (params: any = {}) => {
  const { data } = await api.get('/documents', { params });
  return data.data as Document[];
};

export const uploadDocument = async (docData: Partial<Document>) => {
  const { data } = await api.post('/documents', docData);
  return data.data as Document;
};

export const deleteDocument = async (id: string) => {
  await api.delete(`/documents/${id}`);
};
