import { useState, useEffect, useCallback, useRef } from 'react';
import isOnline from 'is-online';

/**
 * Options for configuring the useNetworkStatus hook
 */
interface NetworkStatusOptions {
  /** Initial backoff time in milliseconds (default: 2000) */
  initialBackoffMs?: number;
  /** Maximum backoff time in milliseconds (default: 30000) */
  maxBackoffMs?: number;
  /** Multiplier for exponential backoff (default: 1.5) */
  backoffFactor?: number;
  /** Maximum number of retries before giving up (default: 10) */
  maxRetries?: number;
}

/**
 * Return value of the useNetworkStatus hook
 */
interface NetworkStatusResult {
  /** Whether the device is currently online */
  isOnline: boolean;
  /** Whether a connection check is currently in progress */
  isChecking: boolean;
  /** Current retry attempt number */
  retryCount: number;
  /** Time until next retry attempt (in seconds) */
  timeUntilRetry: number;
  /** Function to manually trigger a connection check */
  retryNow: () => void;
  /** Maximum number of retries before giving up */
  maxRetries: number;
}

/**
 * Custom hook to track network connectivity with automatic retry functionality
 * @param options Configuration options
 * @returns Network status information and controls
 */
export const useNetworkStatus = ({
  initialBackoffMs = 2000,
  maxBackoffMs = 30000, 
  backoffFactor = 1.5,
  maxRetries = 10
}: NetworkStatusOptions = {}): NetworkStatusResult => {
  // Track if we're online
  const [isOnlineStatus, setIsOnlineStatus] = useState<boolean>(navigator.onLine);
  // Track if we're currently checking connectivity
  const [isChecking, setIsChecking] = useState<boolean>(false);
  // Current retry attempt number
  const [retryCount, setRetryCount] = useState<number>(0);
  // Time until next retry attempt (seconds)
  const [timeUntilRetry, setTimeUntilRetry] = useState<number>(0);
  // Current backoff time
  const [currentBackoff, setCurrentBackoff] = useState<number>(initialBackoffMs);
  
  // Store timer IDs for cleanup
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Check connection status using the is-online library
   */
  const checkConnection = useCallback(async (): Promise<void> => {
    setIsChecking(true);
    
    try {
      const online = await isOnline();
      setIsOnlineStatus(online);
      
      if (online) {
        // Reset retry mechanism when we're back online
        setRetryCount(0);
        setCurrentBackoff(initialBackoffMs);
        setTimeUntilRetry(0);
      } else {
        // If still offline, schedule the next retry
        scheduleRetry();
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsOnlineStatus(false);
      scheduleRetry();
    } finally {
      setIsChecking(false);
    }
  }, [initialBackoffMs]);

  /**
   * Schedule the next retry with exponential backoff
   */
  const scheduleRetry = useCallback((): void => {
    // Clear any existing timers
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    
    // If we've hit the retry cap, stop trying
    if (retryCount >= maxRetries) {
      console.log('Maximum retry attempts reached');
      return;
    }
    
    // Calculate next backoff time with exponential growth
    const nextBackoff = Math.min(currentBackoff * backoffFactor, maxBackoffMs);
    setCurrentBackoff(nextBackoff);
    
    // Update retry count
    setRetryCount(prev => prev + 1);
    
    // Set the time until next retry for UI countdown
    setTimeUntilRetry(Math.ceil(nextBackoff / 1000));
    
    // Start countdown timer (updates every second)
    const countdownInterval = setInterval(() => {
      setTimeUntilRetry(prevTime => {
        if (prevTime <= 1) {
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    countdownTimerRef.current = countdownInterval;
    
    // Schedule the next connection check
    retryTimerRef.current = setTimeout(() => {
      checkConnection();
    }, nextBackoff);
  }, [checkConnection, currentBackoff, retryCount, backoffFactor, maxBackoffMs, maxRetries]);

  /**
   * Manually trigger a connection check
   */
  const retryNow = useCallback((): void => {
    // Clear existing timers
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    
    setTimeUntilRetry(0);
    checkConnection();
  }, [checkConnection]);

  // Setup event listeners for online/offline events
  useEffect(() => {
    const handleOnline = (): void => {
      setIsOnlineStatus(true);
      setRetryCount(0);
      setCurrentBackoff(initialBackoffMs);
      
      // Verify connection with isOnline
      checkConnection();
    };

    const handleOffline = (): void => {
      setIsOnlineStatus(false);
      checkConnection();
    };

    // Initial connection check
    checkConnection();

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [checkConnection, initialBackoffMs]);

  return {
    isOnline: isOnlineStatus,
    isChecking,
    retryCount,
    timeUntilRetry,
    retryNow,
    maxRetries
  };
};