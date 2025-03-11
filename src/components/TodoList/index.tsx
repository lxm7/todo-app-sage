import React, { useState } from "react";
import Button from "carbon-react/lib/components/button";
import TextBox from "carbon-react/lib/components/textbox";
import Box from "carbon-react/lib/components/box";
import { useQuery } from "@tanstack/react-query";

import TodoListItem from "../TodoListItem";
import { fetchTodos } from "../../api";

import type { Todo } from "../TodoListItem";
import { useTodoMutations } from "../../api/mutations";

const TodoList: React.FC = () => {
  const { addTodoMutation } = useTodoMutations();

  const {
    data: todos,
    error,
    isLoading,
  } = useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    initialData: [],
  });

  // Local states for form inputs and edit UI
  const [newTodoText, setNewTodoText] = useState<string>("");

  // Handlers for actions
  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodoMutation.mutate(newTodoText);
      setNewTodoText("");
    }
  };

  if (isLoading) return <div>Loading todos...</div>;
  if (error) return <div>Error loading todos</div>;

  return (
    <Box margin="var(--spacing200)">
      <div
        style={{
          marginBottom: "1rem",
          paddingBottom: "2rem",
          display: "flex",
          borderBottom: "1px solid #ccc",
          gap: "1rem",
          alignItems: "flex-end",
        }}
      >
        <div style={{ flex: 1 }}>
          <TextBox
            id="new-todo-input"
            label="New Todo"
            value={newTodoText}
            placeholder="Enter todo..."
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setNewTodoText(event.target.value)
            }
          />
        </div>
        <Button onClick={handleAddTodo}>Add Todo</Button>
      </div>

      <div>
        {todos.map((todo: Todo) => (
          <TodoListItem todo={todo} />
        ))}
      </div>
    </Box>
  );
};

export default TodoList;
