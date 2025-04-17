"use client";

import { useNetworkStatus } from '@/hooks/use-online-status';
import React from 'react';
const NetworkStatusIndicator = () => {
  const {
    isOnline,
    isChecking,
    timeUntilRetry,
    retryCount,
    retryNow,
    maxRetries
  } = useNetworkStatus({
    initialBackoffMs: 3000,   // Start with 3 seconds
    maxBackoffMs: 60000,      // Cap at 1 minute
    backoffFactor: 2,         // Double the wait time each attempt
    maxRetries: 8             // Stop after 8 attempts
  });

  return (
    <div className="flex flex-col items-center p-4 rounded-lg border w-72 shadow-md">
      <div className="flex items-center mb-4">
        <div 
          className={`w-4 h-4 rounded-full mr-2 ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="font-medium">
          {isOnline ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      
      {!isOnline && (
        <div className="text-center w-full">
          <div className="text-sm text-gray-600 mb-2">
            {isChecking ? (
              'Checking connection...'
            ) : (
              timeUntilRetry > 0 ? (
                `Retrying in ${timeUntilRetry} seconds...`
              ) : (
                retryCount >= maxRetries ? 
                'Maximum retry attempts reached.' :
                'Scheduling retry...'
              )
            )}
          </div>
          
          {retryCount > 0 && retryCount < maxRetries && (
            <div className="text-xs text-gray-500 mb-3">
              Attempt {retryCount} of {maxRetries}
            </div>
          )}
          
          <button
            onClick={retryNow}
            disabled={isChecking}
            className={`px-4 py-2 rounded text-white ${
              isChecking 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isChecking ? 'Checking...' : 'Retry Now'}
          </button>
        </div>
      )}
    </div>
  );
};

export default NetworkStatusIndicator;