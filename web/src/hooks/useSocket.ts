'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';
import { useProjectStore } from '@/store/project.store';
import { usePropertyStore } from '@/store/property.store';
import { useActivityStore } from '@/store/activity.store';
import { useMaintenanceStore } from '@/store/maintenance.store';
import { useNotificationStore } from '@/store/notification.store';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';

export const useSocket = (roomId?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const { accessToken } = useAuthStore();
  const { updateTaskLocally, deleteTaskLocally, addTaskLocally, updateProjectLocally } = useProjectStore();
  const { updateUnitLocally } = usePropertyStore();
  const { addActivityLocally } = useActivityStore();
  const { addRequestLocally, updateRequestLocally } = useMaintenanceStore();
  const { addNotificationLocally } = useNotificationStore();

  useEffect(() => {
    if (!accessToken) return;

    const socket = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 Connected to real-time sync server');
      if (roomId) {
        socket.emit('join-room', roomId);
      }
    });

    // Project/Task events
    socket.on('task:created', (task) => {
      addTaskLocally(task);
    });

    socket.on('task:updated', (task) => {
      updateTaskLocally(task);
    });

    socket.on('task:deleted', ({ id }) => {
      deleteTaskLocally(id);
    });

    // Property/Unit events
    socket.on('unit:updated', (unit) => {
      updateUnitLocally(unit);
    });

    socket.on('activity:new', (activity) => {
      addActivityLocally(activity);
    });

    socket.on('project:updated', (project) => {
      updateProjectLocally(project);
    });

    socket.on('maintenance:new', (request) => {
      addRequestLocally(request);
    });

    socket.on('maintenance:updated', (request) => {
      updateRequestLocally(request);
    });

    socket.on('notification:new', (notification) => {
      addNotificationLocally(notification);
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken, roomId, addTaskLocally, updateTaskLocally, deleteTaskLocally, updateUnitLocally]);

  return socketRef.current;
};
