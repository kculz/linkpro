import { create } from 'zustand';
import * as documentService from '@/services/documentService';

interface DocumentState {
  documents: documentService.Document[];
  loading: boolean;
  fetchDocuments: (params?: any) => Promise<void>;
  addDocument: (data: Partial<documentService.Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  loading: false,
  fetchDocuments: async (params) => {
    set({ loading: true });
    try {
      const documents = await documentService.getDocuments(params);
      set({ documents, loading: false });
    } catch (err) {
      console.error('Failed to fetch documents', err);
      set({ loading: false });
    }
  },
  addDocument: async (data) => {
    const newDoc = await documentService.uploadDocument(data);
    set({ documents: [newDoc, ...get().documents] });
  },
  deleteDocument: async (id) => {
    await documentService.deleteDocument(id);
    set({ documents: get().documents.filter(d => d.id !== id) });
  },
}));
