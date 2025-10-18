import { useState, useEffect, useCallback, useRef } from 'react';
import { UseApiOptions, UseApiReturn } from '@/types';

/**
 * Custom hook for handling API calls with loading states and error handling
 * @param apiFunction - The API function to call
 * @param options - Configuration options
 * @returns Object containing data, loading state, error, and control functions
 */
export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const { immediate = false, onSuccess, onError } = options;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Execute API call
  const execute = useCallback(async (...args: any[]) => {
    if (!isMountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      
      if (isMountedRef.current) {
        setData(result);
        onSuccess?.(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiFunction, onSuccess, onError]);

  // Reset state
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * Custom hook for handling paginated API calls
 * @param apiFunction - The API function that returns paginated data
 * @param initialParams - Initial parameters for the API call
 * @returns Object containing paginated data and pagination controls
 */
export function usePaginatedApi<T = any>(
  apiFunction: (params: any) => Promise<{ data: T[]; pagination: any }>,
  initialParams: any = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async (newParams = params) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(newParams);
      setData(result.data);
      setPagination(result.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, params]);

  const goToPage = useCallback((page: number) => {
    const newParams = { ...params, page };
    setParams(newParams);
    fetchData(newParams);
  }, [params, fetchData]);

  const changeLimit = useCallback((limit: number) => {
    const newParams = { ...params, limit, page: 1 };
    setParams(newParams);
    fetchData(newParams);
  }, [params, fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const updateParams = useCallback((newParams: any) => {
    setParams({ ...params, ...newParams, page: 1 });
    fetchData({ ...params, ...newParams, page: 1 });
  }, [params, fetchData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    pagination,
    loading,
    error,
    goToPage,
    changeLimit,
    refresh,
    updateParams,
  };
}

/**
 * Custom hook for handling form submissions with API calls
 * @param apiFunction - The API function to call on form submission
 * @param options - Configuration options
 * @returns Object containing form state and submission handlers
 */
export function useFormApi<T = any>(
  apiFunction: (data: any) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { onSuccess, onError } = options;

  const submit = useCallback(async (formData: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await apiFunction(formData);
      setData(result);
      setSuccess(true);
      onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    success,
    submit,
    reset,
  };
}

/**
 * Custom hook for handling real-time data updates
 * @param apiFunction - The API function to call for updates
 * @param interval - Update interval in milliseconds
 * @param options - Configuration options
 * @returns Object containing data and control functions
 */
export function useRealtimeApi<T = any>(
  apiFunction: () => Promise<T>,
  interval: number = 5000,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(true);

  const { onSuccess, onError } = options;

  const fetchData = useCallback(async () => {
    if (!isActiveRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction();
      
      if (isActiveRef.current) {
        setData(result);
        onSuccess?.(result);
      }
    } catch (err) {
      if (isActiveRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      if (isActiveRef.current) {
        setLoading(false);
      }
    }
  }, [apiFunction, onSuccess, onError]);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    
    isActiveRef.current = true;
    fetchData(); // Initial fetch
    intervalRef.current = setInterval(fetchData, interval);
  }, [fetchData, interval]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isActiveRef.current = false;
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    data,
    loading,
    error,
    start,
    stop,
    refresh,
  };
}
