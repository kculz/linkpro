import { create } from 'zustand';
import * as teamService from '@/services/teamService';

interface TeamState {
  members: teamService.TeamMember[];
  loading: boolean;
  fetchTeam: () => Promise<void>;
  addEmployee: (data: Partial<teamService.TeamMember>) => Promise<void>;
  updateRole: (id: string, role: string) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  members: [],
  loading: false,
  fetchTeam: async () => {
    set({ loading: true });
    try {
      const members = await teamService.getTeam();
      set({ members });
    } catch (error) {
      console.error('Failed to fetch team:', error);
    } finally {
      set({ loading: false });
    }
  },
  addEmployee: async (data) => {
    const member = await teamService.addEmployee(data);
    set({ members: [member, ...get().members] });
  },
  updateRole: async (id, role) => {
    const updated = await teamService.updateRole(id, role);
    set({ members: get().members.map(m => m.id === id ? updated : m) });
  },
  removeMember: async (id) => {
    await teamService.removeMember(id);
    set({ members: get().members.filter(m => m.id !== id) });
  }
}));
