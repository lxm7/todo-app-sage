import { fetchTodos, postTodo, removeTodo, patchTodo, toggleTodo } from "./";
import type { Todo } from "../components/TodoList";

// Set a default fetch mock (will be re-mocked in individual tests)
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 }),
  })
) as jest.Mock;

describe("API functions", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("fetchTodos", () => {
    it("should return list of todos when response is ok", async () => {
      const mockTodos: Todo[] = [
        { id: "1", text: "Todo 1", completed: false },
        { id: "2", text: "Todo 2", completed: true },
      ];

      // Create a fake response object with ok=true and json() method
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockTodos),
      };

      jest.spyOn(global, "fetch").mockResolvedValue(mockResponse as any);

      const todos = await fetchTodos();
      expect(todos).toEqual(mockTodos);
      expect(global.fetch).toHaveBeenCalledWith("/todos");
    });

    it("should throw an error if response is not ok", async () => {
      const mockResponse = { ok: false, status: 500 };
      jest.spyOn(global, "fetch").mockResolvedValue(mockResponse as any);

      await expect(fetchTodos()).rejects.toThrow("Error fetching todos");
    });
  });

  describe("postTodo", () => {
    it("should post a todo and return the new todo", async () => {
      const newText = "New Todo";
      const newTodo: Todo = { id: "3", text: newText, completed: false };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(newTodo),
      };
      jest.spyOn(global, "fetch").mockResolvedValue(mockResponse as any);

      const result = await postTodo(newText);
      expect(result).toEqual(newTodo);
      expect(global.fetch).toHaveBeenCalledWith("/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });
    });

    it("should throw an error if posting fails", async () => {
      const newText = "New Todo";
      const mockResponse = { ok: false, status: 500 };
      jest.spyOn(global, "fetch").mockResolvedValue(mockResponse as any);

      await expect(postTodo(newText)).rejects.toThrow("Error adding todo");
    });
  });

  describe("removeTodo", () => {
    it("should resolve when deletion is successful", async () => {
      const id = "1";
      const mockResponse = { ok: true };
      jest.spyOn(global, "fetch").mockResolvedValue(mockResponse as any);

      await expect(removeTodo(id)).resolves.toBeUndefined();
      expect(global.fetch).toHaveBeenCalledWith(`/todo/${id}`, {
        method: "DELETE",
      });
    });

    it("should throw an error if deletion fails", async () => {
      const id = "1";
      const mockResponse = { ok: false, status: 404 };
      jest.spyOn(global, "fetch").mockResolvedValue(mockResponse as any);

      await expect(removeTodo(id)).rejects.toThrow("Error deleting todo");
    });
  });

  describe("patchTodo", () => {
    it("should update a todo and return the updated todo", async () => {
      const id = "1";
      const newText = "Updated Todo";
      const updatedTodo: Todo = { id, text: newText, completed: false };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(updatedTodo),
      };
      jest.spyOn(global, "fetch").mockResolvedValue(mockResponse as any);

      const result = await patchTodo({ id, text: newText });
      expect(result).toEqual(updatedTodo);
      expect(global.fetch).toHaveBeenCalledWith(`/todo/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });
    });

    it("should throw an error if patch fails", async () => {
      const id = "1";
      const newText = "Updated Todo";
      const mockResponse = { ok: false };

      jest.spyOn(global, "fetch").mockResolvedValue(mockResponse as any);
      await expect(patchTodo({ id, text: newText })).rejects.toThrow(
        "Error editing todo"
      );
    });
  });

  describe("toggleTodo", () => {
    it("should toggle a todo's completed status and return the updated todo", async () => {
      const id = "1";
      const text = "Todo text";
      const currentCompleted = false;
      const toggledTodo: Todo = { id, text, completed: !currentCompleted };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(toggledTodo),
      };
      jest.spyOn(global, "fetch").mockResolvedValue(mockResponse as any);

      const result = await toggleTodo({
        id,
        text,
        completed: currentCompleted,
      });
      expect(result).toEqual(toggledTodo);
      expect(global.fetch).toHaveBeenCalledWith(`/todo/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, completed: !currentCompleted }),
      });
    });

    it("should throw an error if toggle fails", async () => {
      const id = "1";
      const text = "Todo text";
      const currentCompleted = false;
      const mockResponse = { ok: false };

      jest.spyOn(global, "fetch").mockResolvedValue(mockResponse as any);
      await expect(
        toggleTodo({ id, text, completed: currentCompleted })
      ).rejects.toThrow("Error toggling todo");
    });
  });
});
