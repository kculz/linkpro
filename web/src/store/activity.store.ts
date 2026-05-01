import { create } from 'zustand';
import * as activityService from '@/services/activityService';

interface ActivityState {
  activities: activityService.Activity[];
  loading: boolean;
  fetchActivities: (params?: { targetId?: string; targetType?: string; limit?: number }) => Promise<void>;
  addActivityLocally: (activity: activityService.Activity) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  loading: false,
  fetchActivities: async (params) => {
    set({ loading: true });
    try {
      const activities = await activityService.getActivities(params);
      set({ activities, loading: false });
    } catch (err) {
      console.error('Failed to fetch activities', err);
      set({ loading: false });
    }
  },
  addActivityLocally: (activity) => {
    set((state) => ({
      activities: [activity, ...state.activities.filter(a => a.id !== activity.id)].slice(0, 50)
    }));
  },
}));
