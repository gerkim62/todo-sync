import { Todo } from "@prisma/client";
import { Label } from "./ui/label";

type Props = {
  todo: Todo;
};

const TodoItem = ({ todo }: Props) => {
  return (
    <div className="flex items-center space-x-2 py-2">
      <Label
        htmlFor={`todo-${todo.id}`}
        className={`text-sm ${
          todo.completed ? "line-through text-gray-500" : ""
        }`}
      >
        {todo.text}
      </Label>
    </div>
  );
};

export default TodoItem;
