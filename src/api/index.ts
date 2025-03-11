interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// Fetch all todos from the mock endpoint
export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch("/todos");
  if (!res.ok) {
    throw new Error("Error fetching todos");
  }
  return res.json();
};

// POST a new todo
export const postTodo = async (text: string): Promise<Todo> => {
  const res = await fetch("/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error("Error adding todo");
  }
  return res.json();
};

// DELETE a todo
export const removeTodo = async (id: string): Promise<void> => {
  const res = await fetch(`/todo/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Error deleting todo");
  }
  // Optionally return nothing—React Query can then invalidate and refetch.
  return;
};

// PATCH to edit a todo
export const patchTodo = async ({
  id,
  text,
}: {
  id: string;
  text: string;
}): Promise<Todo> => {
  const res = await fetch(`/todo/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error("Error editing todo");
  }
  return res.json();
};

export const toggleTodo = async ({
  id,
  text,
  completed,
}: {
  id: string;
  text: string;
  completed: boolean;
}): Promise<Todo> => {
  const res = await fetch(`/todo/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, completed: !completed }),
  });
  if (!res.ok) {
    throw new Error("Error toggling todo");
  }
  return res.json();
};
