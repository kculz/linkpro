import { create } from 'zustand';
import * as templateService from '@/services/templateService';

interface TemplateState {
  templates: templateService.Template[];
  loading: boolean;
  fetchTemplates: () => Promise<void>;
  addTemplate: (data: Partial<templateService.Template>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  seedTemplates: () => Promise<void>;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  loading: false,
  fetchTemplates: async () => {
    set({ loading: true });
    try {
      const templates = await templateService.getTemplates();
      set({ templates });
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      set({ loading: false });
    }
  },
  addTemplate: async (data) => {
    const template = await templateService.createTemplate(data);
    set({ templates: [template, ...get().templates] });
  },
  deleteTemplate: async (id) => {
    await templateService.deleteTemplate(id);
    set({ templates: get().templates.filter(t => t.id !== id) });
  },
  seedTemplates: async () => {
    await templateService.seedTemplates();
    await get().fetchTemplates();
  }
}));
