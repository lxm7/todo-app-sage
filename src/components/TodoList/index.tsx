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
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type EditTodoVariables = Required<Pick<Todo, "id" | "text">>;

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

  const editTodoMutation = useMutation<Todo, Error, EditTodoVariables>({
    mutationFn: patchTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const toggleTodoMutation = useMutation<Todo, Error, Todo>({
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
      <div
        style={{
          marginBottom: "2rem",
          paddingBottom: "2rem",
          display: "flex",
          borderBottom: "1px solid #ccc",
          gap: "1rem", // Adds spacing between elements
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
          <div
            key={todo.id}
            style={{
              marginBottom: "1rem",
              paddingBottom: "1rem",
              display: "flex",
              borderBottom: "1px solid #ccc",
              gap: "1rem",
              alignItems: "center",
              width: "100%", // Ensure full width
            }}
          >
            {/* Checkbox Section - Left-aligned */}
            <div style={{ flexShrink: 0 }}>
              <Checkbox
                id={`todo-${todo.id}`}
                label={todo.text}
                checked={todo.completed}
                onChange={() =>
                  handleToggleCompleted({ ...todo, completed: !todo.completed })
                }
              />
            </div>

            {/* Middle Section - Grows to available space */}
            {editTodoId === todo.id ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1, width: "100%" }}>
                  <TextBox
                    id={`edit-todo-${todo.id}`}
                    value={editText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditText(e.target.value)
                    }
                  />
                </div>
                <div
                  style={{
                    marginLeft: "auto", // Pushes buttons to far right
                    display: "flex",
                    gap: "1rem",
                  }}
                >
                  <Button onClick={() => handleEditTodo(todo.id)}>Save</Button>
                  <Button onClick={() => setEditTodoId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              /* Right-aligned Buttons Section */
              <div
                style={{
                  marginLeft: "auto", // Pushes buttons to far right
                  display: "flex",
                  gap: "1rem",
                }}
              >
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
              </div>
            )}
          </div>
        ))}
      </div>
    </Box>
  );
};

export default TodoList;
