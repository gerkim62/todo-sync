"use client";
import { addManyTodos } from "@/actions/todo";
import { Button } from "@/components/ui/button";
import { dexieDb } from "@/lib/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { RefreshCcw, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import isNetworkError from "is-network-error";

type Status =
  | "idle"
  | "syncing"
  | "success"
  | "network-error"
  | "unknown-error";

const SyncUI = () => {
  const unsynced = useLiveQuery(() => {
    return dexieDb.todos.toArray();
  });

  const [status, setStatus] = useState<Status>("idle");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setStatus("idle");
    addEventListener("online", () => {
      handleSync();
    });

    return () => {
      removeEventListener("online", () => {
        handleSync();
      });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSync = async () => {
    if (!unsynced || unsynced.length === 0) return;

    try {
      setStatus("syncing");

      const res = await addManyTodos(
        unsynced.map((todo) => ({
          text: todo.text,
          completed: todo.completed,
        }))
      );

      if (res) {
        await dexieDb.todos.clear();
        setStatus("success");
        // Reset status after 2 seconds
      } else {
        console.error("Error syncing todos");
        setStatus("unknown-error");
      }
    } catch (error) {
      console.error("Error syncing todos", error);

      if (isNetworkError(error)) {
        setStatus("network-error");
      } else {
        setStatus("unknown-error");
      }
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!unsynced || unsynced.length === 0) return null;

  const count = unsynced.length;

  return (
    <div className="fixed top-8 right-8 flex flex-col gap-2 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-lg max-w-sm">
      {/* Status notifications */}
      {status === "success" && (
        <div className="mb-2 p-2 bg-green-100 text-green-800 rounded">
          <p className="text-sm">Success!</p>
        </div>
      )}

      {status === "network-error" && (
        <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 rounded">
          <p className="text-sm">You are offline.</p>
        </div>
      )}

      {status === "unknown-error" && (
        <div className="mb-2 p-2 bg-red-100 text-red-800 rounded">
          <p className="text-sm">Error occurred</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">{count} unsynced</div>
        <div className="flex items-center gap-2">
          <Button
            onClick={toggleExpanded}
            variant="ghost"
            size="sm"
            className="p-1 h-8 w-8"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={handleSync}
            variant="default"
            size="sm"
            disabled={status === "syncing"}
            className="flex items-center gap-1 h-8"
          >
            <RefreshCcw
              className={`w-4 h-4 transition-transform ${
                status === "syncing" ? "animate-spin" : ""
              }`}
            />
            <span>Sync</span>
          </Button>
        </div>
      </div>

      {/* Expandable list of unsynced todos */}
      {isExpanded && (
        <div className="mt-2 max-h-64 overflow-y-auto">
          <ul className="space-y-1">
            {unsynced.map((todo, index) => (
              <li
                key={index}
                className="p-2 bg-gray-50 dark:bg-slate-800 rounded text-sm flex items-center gap-2"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    todo.completed ? "bg-green-500" : "bg-blue-500"
                  }`}
                ></span>
                <span className="truncate">{todo.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { SyncUI };
