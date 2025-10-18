import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { User, NotificationProps, AppContextType } from '@/types';

// Initial state
const initialState = {
  user: null,
  notifications: [],
  isLoading: false,
  error: null,
};

// Action types
const ActionTypes = {
  SET_USER: 'SET_USER',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_ALL_NOTIFICATIONS: 'CLEAR_ALL_NOTIFICATIONS',
} as const;

// Action types
// type ActionType = typeof ActionTypes[keyof typeof ActionTypes];

// Action interfaces
interface SetUserAction {
  type: typeof ActionTypes.SET_USER;
  payload: User | null;
}

interface AddNotificationAction {
  type: typeof ActionTypes.ADD_NOTIFICATION;
  payload: Omit<NotificationProps, 'id' | 'isVisible'>;
}

interface RemoveNotificationAction {
  type: typeof ActionTypes.REMOVE_NOTIFICATION;
  payload: string;
}

interface SetLoadingAction {
  type: typeof ActionTypes.SET_LOADING;
  payload: boolean;
}

interface SetErrorAction {
  type: typeof ActionTypes.SET_ERROR;
  payload: string | null;
}

interface ClearErrorAction {
  type: typeof ActionTypes.CLEAR_ERROR;
}

interface ClearAllNotificationsAction {
  type: typeof ActionTypes.CLEAR_ALL_NOTIFICATIONS;
}

type Action = 
  | SetUserAction 
  | AddNotificationAction 
  | RemoveNotificationAction 
  | SetLoadingAction 
  | SetErrorAction 
  | ClearErrorAction
  | ClearAllNotificationsAction;

// State interface
interface AppState {
  user: User | null;
  notifications: NotificationProps[];
  isLoading: boolean;
  error: string | null;
}

// Reducer function
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return { ...state, user: action.payload };
    case ActionTypes.ADD_NOTIFICATION:
      const newNotification: NotificationProps = {
        ...action.payload,
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        isVisible: true,
      };
      return {
        ...state,
        notifications: [...state.notifications, newNotification],
      };
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    case ActionTypes.CLEAR_ALL_NOTIFICATIONS:
      return { ...state, notifications: [] };
    default:
      return state;
  }
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component props
interface AppProviderProps {
  children: React.ReactNode;
}

// Provider component
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const setUser = useCallback((user: User | null) => {
    dispatch({ type: ActionTypes.SET_USER, payload: user });
  }, []);

  const addNotification = useCallback((notification: Omit<NotificationProps, 'id' | 'isVisible'>) => {
    dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification });
  }, []);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  }, []);

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ALL_NOTIFICATIONS });
  }, []);

  // Auto-remove notifications after their duration
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    state.notifications.forEach(notification => {
      if (notification.duration !== 0) {
        const timeoutId = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration || 5000);
        timeouts.push(timeoutId);
      }
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [state.notifications, removeNotification]);

  // Persist user to localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUser(user);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, [setUser]);

  const value: AppContextType = {
    ...state,
    setUser,
    addNotification,
    removeNotification,
    setIsLoading,
    setError,
    clearError,
    clearAllNotifications,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
