import React, { useState, useEffect } from "react";
import Button from "carbon-react/lib/components/button";
import TextBox from "carbon-react/lib/components/textbox";
import { Checkbox } from "carbon-react/lib/components/checkbox";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [editTodoId, setEditTodoId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  // Fetch initial todos using the GET /todos mock endpoint
  useEffect(() => {
    fetch("/todos")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch todos");
        }
        return res.json();
      })
      .then((data) => setTodos(data))
      .catch((error) => console.error(error));
  }, []);

  // Add a new todo by calling the POST /todos endpoint
  const handleAddTodo = async () => {
    if (!newTodoText.trim()) return;

    try {
      const res = await fetch("/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTodoText }),
      });
      if (!res.ok) {
        throw new Error("Failed to add todo");
      }
      const newTodo: Todo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
      setNewTodoText("");
    } catch (error) {
      console.error(error);
    }
  };

  // Delete a todo by calling the DELETE /todo/:id endpoint
  const handleDeleteTodo = async (id: string) => {
    try {
      const res = await fetch(`/todo/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete todo");
      }
      // Optionally, you could verify the response data here
      await res.json();
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Edit a todo by calling the PATCH /todo/:id endpoint with { text: newText }
  const handleEditTodo = async (id: string, newText: string) => {
    try {
      const res = await fetch(`/todo/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });
      if (!res.ok) {
        throw new Error("Failed to update todo");
      }
      const updatedTodo: Todo = await res.json();
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      setEditTodoId(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Optionally implement toggle of completion status. Note: For this to work,
  // your PATCH handler should also merge a "completed" property; update your types if needed.
  const handleToggleCompleted = async (id: string, current: boolean) => {
    // Find the current todo so that we can keep its text
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const res = await fetch(`/todo/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: todo.text, completed: !current }),
      });
      if (!res.ok) {
        throw new Error("Failed to toggle todo");
      }
      const updatedTodo: Todo = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <TextBox
          id="new-todo-input"
          label="New Todo"
          value={newTodoText}
          placeholder="Enter todo..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewTodoText(e.target.value)
          }
        />
        <Button onClick={handleAddTodo}>Add Todo</Button>
      </div>

      <div>
        {todos.map((todo) => (
          <div key={todo.id}>
            <Checkbox
              id={`todo-${todo.id}`}
              label={todo.text}
              checked={todo.completed}
              onChange={() => handleToggleCompleted(todo.id, todo.completed)}
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
                <Button onClick={() => handleEditTodo(todo.id, editText)}>
                  Save
                </Button>
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
    </div>
  );
};

export default TodoList;
