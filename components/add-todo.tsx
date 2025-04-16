"use client";

import { Plus, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FormEvent, useState } from "react";
import { addTodo } from "@/actions/todo";
import { dexieDb } from "@/lib/dexie";

import isNetworkError from "is-network-error";

type Status =
  | "idle"
  | "loading"
  | "success"
  | "unknown-error"
  | "network-error";

const AddTodo = () => {
  const [status, setStatus] = useState<Status>("idle");

  const handleAddTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const todoText = formData.get("todo");

    if (todoText && typeof todoText === "string" && todoText.trim() !== "") {
      setStatus("loading");
      try {
        await addTodo({ text: todoText });
      } catch (error) {
        // Save to local IndexedDB as fallback
        dexieDb.todos.add({
          text: todoText,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.error("Error adding todo:", error);

        // Check if it's a network error
        if (isNetworkError(error)) {
          setStatus("network-error");
        } else {
          setStatus("unknown-error");
        }
      }
    } else {
      setStatus("unknown-error");
    }
  };

  return (
    <div key={Math.random()} className="w-full">
      {/* Status notifications */}
      {status === "success" && (
        <div className="mb-2 p-2 bg-green-100 text-green-800 rounded">
          <p className="text-sm">Todo added successfully!</p>
        </div>
      )}

      {status === "network-error" && (
        <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 rounded">
          <p className="text-sm">
            Network error! Todo saved locally and will sync when you are back
            online.
          </p>
        </div>
      )}

      {status === "unknown-error" && (
        <div className="mb-2 p-2 bg-red-100 text-red-800 rounded">
          <p className="text-sm">Error adding todo. Please try again.</p>
        </div>
      )}

      <form
        onSubmit={handleAddTodo}
        className="flex w-full items-center space-x-2 mt-1"
      >
        <Input
          name="todo"
          placeholder="Add new todo..."
          className={`flex-grow ${
            status === "unknown-error" ? "border-red-500" : ""
          }`}
          disabled={status === "loading"}
        />
        <Button
          size="sm"
          disabled={status === "loading"}
          variant={
            status === "success"
              ? "default"
              : status === "unknown-error"
              ? "destructive"
              : "default"
          }
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-1" />
          )}
          Add
        </Button>
      </form>
    </div>
  );
};

export default AddTodo;
