// db/todo-db.ts
import Dexie, { Table } from "dexie";

export interface DexieTodo {
  dexieId?: number; // Optional for Dexie,
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TodoDB extends Dexie {
  todos!: Table<DexieTodo, number>;

  constructor() {
    super("todo_db");
    this.version(2).stores({
      todos: "++dexieId, text, completed, createdAt, updatedAt",
    });

    this.todos.mapToClass(
      class implements DexieTodo {
        dexieId?: number;
        text!: string;
        completed = false;
        createdAt = new Date();
        updatedAt = new Date();
      }
    );
  }
}

export const dexieDb = new TodoDB();
