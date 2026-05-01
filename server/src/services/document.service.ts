import Document from '@models/Document.js';
import User from '@models/User.js';

export const getAllDocuments = async (query: any = {}) => {
  return Document.findAll({
    where: query,
    include: [{ model: User, as: 'uploader', attributes: ['name'] }],
    order: [['createdAt', 'DESC']]
  });
};

export const createDocument = async (data: any) => {
  return Document.create(data);
};

export const deleteDocument = async (id: string) => {
  const doc = await Document.findByPk(id);
  if (!doc) throw new Error('Document not found');
  return doc.destroy();
};
