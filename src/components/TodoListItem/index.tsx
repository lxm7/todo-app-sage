import React, { useState } from "react";
import Button from "carbon-react/lib/components/button";
import TextBox from "carbon-react/lib/components/textbox";
import { Checkbox } from "carbon-react/lib/components/checkbox";
import { useTodoMutations } from "../../api/mutations"; // adjust the path accordingly

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export type EditTodoVariables = Pick<Todo, "id" | "text">;
export type TodoTextInput = Pick<Todo, "text" | "completed">;

export interface TodoListItemProps {
  todo: Todo;
}

const TodoListItem: React.FC<TodoListItemProps> = ({ todo }) => {
  const { deleteTodoMutation, editTodoMutation, toggleTodoMutation } =
    useTodoMutations();

  const [editTodoId, setEditTodoId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

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
    toggleTodoMutation.mutate({
      id: todo.id,
      text: todo.text,
      completed: !todo.completed,
    });
  };

  return (
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
          <Button onClick={() => handleDeleteTodo(todo.id)}>Delete</Button>
        </div>
      )}
    </div>
  );
};

export default TodoListItem;
