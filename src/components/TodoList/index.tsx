import React, { useState } from "react";
import Button from "carbon-react/lib/components/button";
import TextBox from "carbon-react/lib/components/textbox";
import { Checkbox } from "carbon-react/lib/components/checkbox";
import Box from "carbon-react/lib/components/box";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchTodos,
  postTodo,
  removeTodo,
  patchTodo,
  toggleTodo,
} from "../../api";
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const queryClient = useQueryClient();
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
  const [editTodoId, setEditTodoId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  // Mutation for adding a new todo
  const addTodoMutation = useMutation<Todo, Error, string>({
    mutationFn: postTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Mutation for deleting a todo
  const deleteTodoMutation = useMutation<void, Error, string>({
    mutationFn: removeTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Mutation for editing a todo
  interface EditTodoVariables {
    id: string;
    text: string;
  }

  const editTodoMutation = useMutation<Todo, Error, EditTodoVariables>({
    mutationFn: patchTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Mutation for toggling a todo's completed status
  interface ToggleTodoVariables {
    id: string;
    text: string;
    completed: boolean;
  }

  const toggleTodoMutation = useMutation<Todo, Error, ToggleTodoVariables>({
    mutationFn: toggleTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Handlers for actions
  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodoMutation.mutate(newTodoText);
      setNewTodoText("");
    }
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  const handleEditTodo = (id: string) => {
    if (editText.trim()) {
      editTodoMutation.mutate({ id, text: editText });
      setEditTodoId(null);
    }
  };

  const handleToggleCompleted = (todo: Todo) => {
    console.log({ todo });
    toggleTodoMutation.mutate({
      id: todo.id,
      text: todo.text,
      completed: !todo.completed,
    });
  };

  if (isLoading) return <div>Loading todos...</div>;
  if (error) return <div>Error loading todos</div>;

  return (
    <Box margin="var(--spacing200)">
      <div>
        <TextBox
          id="new-todo-input"
          label="New Todo"
          value={newTodoText}
          placeholder="Enter todo..."
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setNewTodoText(event.target.value)
          }
        />
        <Button onClick={handleAddTodo}>Add Todo</Button>
      </div>

      <div>
        {todos.map((todo: Todo) => (
          <div key={todo.id}>
            <Checkbox
              id={`todo-${todo.id}`}
              label={todo.text}
              checked={todo.completed}
              onChange={() =>
                handleToggleCompleted({ ...todo, completed: !todo.completed })
              }
            />

            {editTodoId === todo.id ? (
              <>
                <TextBox
                  id={`edit-todo-${todo.id}`}
                  value={editText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditText(e.target.value)
                  }
                />
                <Button onClick={() => handleEditTodo(todo.id)}>Save</Button>
                <Button onClick={() => setEditTodoId(null)}>Cancel</Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setEditTodoId(todo.id);
                    setEditText(todo.text);
                  }}
                >
                  Edit
                </Button>
                <Button onClick={() => handleDeleteTodo(todo.id)}>
                  Delete
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </Box>
  );
};

export default TodoList;
