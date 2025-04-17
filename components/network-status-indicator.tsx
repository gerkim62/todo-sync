"use client";

import useOnlineStatus from "@/hooks/use-online-status";
import React, { memo } from "react";

const NetworkStatusIndicator: React.FC = memo(() => {
  const { isOnline, isChecking, checkNow } = useOnlineStatus();

  console.log("NetworkStatusIndicator rendered");
  console.log("isOnline:", isOnline);
  console.log("isChecking:", isChecking);

  return (
    <div className="flex flex-col items-center p-4 rounded-lg border w-72 shadow-md">
      <div className="flex items-center mb-2">
        <div
          className={`w-4 h-4 rounded-full mr-2 ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="font-medium">
          {isOnline ? "Connected" : "Disconnected"}
        </span>
      </div>

      {!isOnline && (
        <>
          <div className="text-sm text-gray-600 mb-2">
            {isChecking ? "Checking connection..." : "Offline"}
          </div>
          <button
            onClick={checkNow}
            disabled={isChecking}
            className={`px-4 py-2 rounded text-white text-sm ${
              isChecking
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isChecking ? "Checking..." : "Check Connection"}
          </button>
        </>
      )}
    </div>
  );
});

NetworkStatusIndicator.displayName = "NetworkStatusIndicator";

export default NetworkStatusIndicator;
