import { create } from 'zustand';
import * as ProjectService from '@/services/projectService';
import * as TaskService from '@/services/taskService';

interface ProjectState {
  projects: (ProjectService.Project & { tasks?: TaskService.Task[] })[];
  currentProject: (ProjectService.Project & { tasks?: TaskService.Task[] }) | null;
  allTasks: TaskService.Task[];
  stats: any | null;
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  fetchAllTasks: () => Promise<void>;
  fetchStats: () => Promise<void>;
  addProject: (data: Partial<ProjectService.Project>) => Promise<void>;
  addTask: (data: Partial<TaskService.Task>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskService.Task['status']) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  allTasks: [],
  stats: null,
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await ProjectService.getProjects();
      set({ projects, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch projects', loading: false });
    }
  },

  fetchProjectById: async (id) => {
    set({ loading: true, error: null });
    try {
      const project = await ProjectService.getProjectById(id);
      const tasks = await TaskService.getTasks(id);
      set({ currentProject: { ...project, tasks }, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch project', loading: false });
    }
  },
  fetchAllTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await TaskService.getTasks();
      set({ allTasks: tasks, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch all tasks', loading: false });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await ProjectService.getProjectStats();
      set({ stats });
    } catch (err) {
      console.error('Failed to fetch project stats', err);
    }
  },

  addProject: async (data) => {
    set({ loading: true, error: null });
    try {
      const newProject = await ProjectService.createProject(data);
      set((state) => ({ 
        projects: [newProject, ...state.projects],
        loading: false 
      }));
    } catch (err) {
      set({ error: 'Failed to create project', loading: false });
      throw err;
    }
  },

  addTask: async (data) => {
    set({ loading: true, error: null });
    try {
      const newTask = await TaskService.createTask(data);
      set((state) => {
        const updatedCurrent = state.currentProject?.id === data.projectId
          ? { ...state.currentProject, tasks: [...(state.currentProject.tasks || []), newTask] }
          : state.currentProject;
        
        return {
          currentProject: updatedCurrent,
          loading: false
        };
      });
    } catch (err) {
      set({ error: 'Failed to add task', loading: false });
      throw err;
    }
  },

  updateTaskStatus: async (taskId, status) => {
    try {
      const updatedTask = await TaskService.updateTaskStatus(taskId, status);
      set((state) => {
        // Update in allTasks
        const updatedAllTasks = state.allTasks.map(t => 
          t.id === taskId ? updatedTask : t
        );

        // Update in currentProject if applicable
        if (!state.currentProject) return { allTasks: updatedAllTasks };
        
        const updatedTasks = state.currentProject.tasks?.map(t => 
          t.id === taskId ? updatedTask : t
        );
        
        const total = updatedTasks?.length || 0;
        const done = updatedTasks?.filter(t => t.status === 'DONE').length || 0;
        const progress = total > 0 ? Math.round((done / total) * 100) : state.currentProject.progress;

        return {
          allTasks: updatedAllTasks,
          currentProject: { ...state.currentProject, tasks: updatedTasks, progress }
        };
      });
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  },

  deleteTask: async (taskId) => {
    try {
      await TaskService.deleteTask(taskId);
      set((state) => {
        if (!state.currentProject) return state;
        const updatedTasks = state.currentProject.tasks?.filter(t => t.id !== taskId);
        return {
          currentProject: { ...state.currentProject, tasks: updatedTasks }
        };
      });
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  },
}));
