'use client';

/**
 * ARC Workflow Context
 * Provides centralized state management for ARC workflow operations
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ARCRequest, ARCStatus } from './types';
import { workflowEngine, WorkflowUtils } from './workflow';
import { useAuth } from '@/lib/auth/context';

interface WorkflowState {
  requests: ARCRequest[];
  activeTransitions: Map<string, boolean>;
  notifications: WorkflowNotification[];
  isLoading: boolean;
  error: string | null;
}

interface WorkflowNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  requestId?: string;
  timestamp: Date;
  isRead: boolean;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

type WorkflowAction = 
  | { type: 'LOAD_REQUESTS'; payload: ARCRequest[] }
  | { type: 'ADD_REQUEST'; payload: ARCRequest }
  | { type: 'UPDATE_REQUEST'; payload: ARCRequest }
  | { type: 'START_TRANSITION'; payload: { requestId: string } }
  | { type: 'COMPLETE_TRANSITION'; payload: { requestId: string; updatedRequest: ARCRequest } }
  | { type: 'ADD_NOTIFICATION'; payload: WorkflowNotification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS'; payload: string[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface WorkflowContextType {
  state: WorkflowState;
  // Request management
  loadRequests: () => Promise<void>;
  createRequest: (request: Omit<ARCRequest, 'id'>) => Promise<string>;
  updateRequest: (requestId: string, updates: Partial<ARCRequest>) => Promise<void>;
  
  // Workflow transitions
  transitionRequest: (requestId: string, targetStatus: ARCStatus, notes?: string) => Promise<{ success: boolean; message: string }>;
  getAvailableTransitions: (requestId: string) => any[];
  autoProcessTransitions: (requestId: string) => Promise<void>;
  
  // Workflow utilities
  getWorkflowSteps: (requestId: string) => any[];
  calculateProgress: (requestId: string) => number;
  getEstimatedCompletion: (requestId: string) => Date | null;
  getRequiredActions: (requestId: string) => string[];
  canPerformAction: (requestId: string, action: string) => boolean;
  
  // Notifications
  addNotification: (notification: Omit<WorkflowNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: (requestId?: string) => void;
  getUnreadNotifications: () => WorkflowNotification[];
}

const initialState: WorkflowState = {
  requests: [],
  activeTransitions: new Map(),
  notifications: [],
  isLoading: false,
  error: null
};

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'LOAD_REQUESTS':
      return {
        ...state,
        requests: action.payload,
        isLoading: false,
        error: null
      };

    case 'ADD_REQUEST':
      return {
        ...state,
        requests: [action.payload, ...state.requests]
      };

    case 'UPDATE_REQUEST':
      return {
        ...state,
        requests: state.requests.map(req => 
          req.id === action.payload.id ? action.payload : req
        )
      };

    case 'START_TRANSITION':
      const newActiveTransitions = new Map(state.activeTransitions);
      newActiveTransitions.set(action.payload.requestId, true);
      return {
        ...state,
        activeTransitions: newActiveTransitions
      };

    case 'COMPLETE_TRANSITION':
      const updatedActiveTransitions = new Map(state.activeTransitions);
      updatedActiveTransitions.delete(action.payload.requestId);
      return {
        ...state,
        activeTransitions: updatedActiveTransitions,
        requests: state.requests.map(req => 
          req.id === action.payload.requestId ? action.payload.updatedRequest : req
        )
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          {
            ...action.payload,
            id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            isRead: false
          },
          ...state.notifications
        ]
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif => 
          notif.id === action.payload ? { ...notif, isRead: true } : notif
        )
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: state.notifications.filter(notif => 
          !action.payload.includes(notif.id)
        )
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    default:
      return state;
  }
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);
  const { currentUser, currentRole } = useAuth();

  // Load requests on mount
  useEffect(() => {
    loadRequests();
  }, []);

  // Auto-process eligible transitions periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      for (const request of state.requests) {
        if (!state.activeTransitions.has(request.id)) {
          await autoProcessTransitions(request.id);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [state.requests, state.activeTransitions]);

  const loadRequests = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // In a real app, this would fetch from an API
      const stored = localStorage.getItem('hoa-connect-arc-requests');
      const requests = stored ? JSON.parse(stored) : [];
      
      // Convert date strings back to Date objects
      const parsedRequests = requests.map((request: any) => ({
        ...request,
        submittedAt: new Date(request.submittedAt),
        updatedAt: new Date(request.updatedAt),
        stageHistory: request.stageHistory?.map((stage: any) => ({
          ...stage,
          enteredAt: new Date(stage.enteredAt)
        })) || [],
        conversations: request.conversations?.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp)
        })) || []
      }));

      dispatch({ type: 'LOAD_REQUESTS', payload: parsedRequests });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load requests' });
    }
  };

  const createRequest = async (requestData: Omit<ARCRequest, 'id'>): Promise<string> => {
    const newRequest: ARCRequest = {
      ...requestData,
      id: `arc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'submitted',
      currentStage: 'submitted',
      submittedAt: new Date(),
      updatedAt: new Date(),
      stageHistory: [{
        stage: 'submitted',
        enteredAt: new Date(),
        enteredBy: currentUser?.name || 'Unknown User',
        notes: 'Request submitted'
      }]
    };

    dispatch({ type: 'ADD_REQUEST', payload: newRequest });
    
    // Persist to localStorage
    const updatedRequests = [newRequest, ...state.requests];
    localStorage.setItem('hoa-connect-arc-requests', JSON.stringify(updatedRequests));

    // Add notification
    addNotification({
      type: 'success',
      title: 'Request Submitted',
      message: `Your ARC request "${newRequest.title}" has been submitted successfully.`,
      requestId: newRequest.id
    });

    // Auto-process initial transitions
    setTimeout(() => autoProcessTransitions(newRequest.id), 1000);

    return newRequest.id;
  };

  const updateRequest = async (requestId: string, updates: Partial<ARCRequest>): Promise<void> => {
    const request = state.requests.find(r => r.id === requestId);
    if (!request) return;

    const updatedRequest = {
      ...request,
      ...updates,
      updatedAt: new Date()
    };

    dispatch({ type: 'UPDATE_REQUEST', payload: updatedRequest });
    
    // Persist to localStorage
    const updatedRequests = state.requests.map(r => r.id === requestId ? updatedRequest : r);
    localStorage.setItem('hoa-connect-arc-requests', JSON.stringify(updatedRequests));
  };

  const transitionRequest = async (
    requestId: string, 
    targetStatus: ARCStatus, 
    notes?: string
  ): Promise<{ success: boolean; message: string }> => {
    const request = state.requests.find(r => r.id === requestId);
    if (!request) {
      return { success: false, message: 'Request not found' };
    }

    dispatch({ type: 'START_TRANSITION', payload: { requestId } });

    try {
      const result = await workflowEngine.processTransition(
        request, 
        targetStatus, 
        currentUser?.name || 'Unknown User',
        notes
      );

      if (result.success && result.updatedRequest) {
        dispatch({ 
          type: 'COMPLETE_TRANSITION', 
          payload: { 
            requestId, 
            updatedRequest: result.updatedRequest 
          }
        });

        // Persist to localStorage
        const updatedRequests = state.requests.map(r => 
          r.id === requestId ? result.updatedRequest! : r
        );
        localStorage.setItem('hoa-connect-arc-requests', JSON.stringify(updatedRequests));

        // Add notification
        addNotification({
          type: 'success',
          title: 'Status Updated',
          message: `Request "${request.title}" has been moved to ${targetStatus}.`,
          requestId
        });

        // Auto-process any follow-up transitions
        setTimeout(() => autoProcessTransitions(requestId), 2000);
      } else {
        dispatch({ type: 'COMPLETE_TRANSITION', payload: { requestId, updatedRequest: request } });
        
        addNotification({
          type: 'error',
          title: 'Transition Failed',
          message: result.message,
          requestId
        });
      }

      return result;
    } catch (error) {
      dispatch({ type: 'COMPLETE_TRANSITION', payload: { requestId, updatedRequest: request } });
      return { success: false, message: 'Failed to process transition' };
    }
  };

  const getAvailableTransitions = (requestId: string) => {
    const request = state.requests.find(r => r.id === requestId);
    if (!request || !currentRole) return [];

    return workflowEngine.getAvailableTransitions(request, currentRole);
  };

  const autoProcessTransitions = async (requestId: string): Promise<void> => {
    const request = state.requests.find(r => r.id === requestId);
    if (!request || state.activeTransitions.has(requestId)) return;

    try {
      const updatedRequest = await workflowEngine.autoProcessTransitions(request);
      
      if (updatedRequest.status !== request.status) {
        dispatch({ type: 'UPDATE_REQUEST', payload: updatedRequest });
        
        // Persist to localStorage
        const updatedRequests = state.requests.map(r => 
          r.id === requestId ? updatedRequest : r
        );
        localStorage.setItem('hoa-connect-arc-requests', JSON.stringify(updatedRequests));

        // Add notification for auto-transition
        addNotification({
          type: 'info',
          title: 'Status Auto-Updated',
          message: `Request "${request.title}" automatically moved to ${updatedRequest.status}.`,
          requestId
        });
      }
    } catch (error) {
      console.error('Auto-processing failed:', error);
    }
  };

  const getWorkflowSteps = (requestId: string) => {
    const request = state.requests.find(r => r.id === requestId);
    if (!request) return [];

    return workflowEngine.getWorkflowSteps(request);
  };

  const calculateProgress = (requestId: string): number => {
    const request = state.requests.find(r => r.id === requestId);
    if (!request) return 0;

    return WorkflowUtils.calculateProgress(request);
  };

  const getEstimatedCompletion = (requestId: string): Date | null => {
    const request = state.requests.find(r => r.id === requestId);
    if (!request) return null;

    return WorkflowUtils.getEstimatedCompletion(request);
  };

  const getRequiredActions = (requestId: string): string[] => {
    const request = state.requests.find(r => r.id === requestId);
    if (!request) return [];

    return WorkflowUtils.getRequiredActions(request);
  };

  const canPerformAction = (requestId: string, action: string): boolean => {
    const request = state.requests.find(r => r.id === requestId);
    if (!request || !currentRole) return false;

    return WorkflowUtils.canPerformAction(request, action as any, currentRole);
  };

  const addNotification = (notification: Omit<WorkflowNotification, 'id' | 'timestamp' | 'isRead'>): void => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markNotificationRead = (notificationId: string): void => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const clearNotifications = (requestId?: string): void => {
    const notificationIds = state.notifications
      .filter(notif => !requestId || notif.requestId === requestId)
      .map(notif => notif.id);
    
    dispatch({ type: 'CLEAR_NOTIFICATIONS', payload: notificationIds });
  };

  const getUnreadNotifications = (): WorkflowNotification[] => {
    return state.notifications.filter(notif => !notif.isRead);
  };

  const contextValue: WorkflowContextType = {
    state,
    loadRequests,
    createRequest,
    updateRequest,
    transitionRequest,
    getAvailableTransitions,
    autoProcessTransitions,
    getWorkflowSteps,
    calculateProgress,
    getEstimatedCompletion,
    getRequiredActions,
    canPerformAction,
    addNotification,
    markNotificationRead,
    clearNotifications,
    getUnreadNotifications
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow(): WorkflowContextType {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}

export default WorkflowContext;
