import AddTodo from "@/components/add-todo";
import TodoItem from "@/components/todo-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";

const TodoApp = async () => {
  const todosPromise = prisma.todo.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: 7,
  });

  const countPromise = prisma.todo.count();

  const [todos, count] = await Promise.all([todosPromise, countPromise]);

  return (
    <div className="flex justify-center w-full p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">My Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Todo List */}
          <div className="space-y-1">
            {
              <div className="text-center ">
                Showing {todos.length} of {count} todos
              </div>
            }

            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>

          {/* Add Todo Form */}
          <AddTodo key={Math.random()} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoApp;
