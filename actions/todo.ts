"use server";

import prisma from "@/lib/prisma";
import { Todo } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type NewTodoInput = Pick<Todo, "text">;
type UpdateTodoInput = Pick<Todo, "text" | "completed" | "id">;
type DeleteTodoInput = Pick<Todo, "id">;

async function addTodo(newTodo: NewTodoInput) {
  const todo = await prisma.todo.create({
    data: newTodo,
  });

  revalidatePath("/");

  return todo;
}

async function addManyTodos(newTodos: NewTodoInput[]) {

  console.log("Adding many todos", newTodos);

  const todos = await prisma.todo.createMany({
    data: newTodos,
  });

  revalidatePath("/");

  return todos;
}

function updateTodo(updatedTodo: UpdateTodoInput) {
  const todo = prisma.todo.update({
    where: { id: updatedTodo.id },
    data: updatedTodo,
  });

  revalidatePath("/");

  return todo;
}

async function deleteTodo(deletedTodo: DeleteTodoInput) {
  const result = await prisma.todo.delete({
    where: { id: deletedTodo.id },
  });

  revalidatePath("/");

  return result;
}

export { addTodo, updateTodo, deleteTodo, addManyTodos };
