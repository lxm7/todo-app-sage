import { renderHook, waitFor, act } from "@testing-library/react";
import {
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useTodoMutations } from "./mutations";
import { removeTodo, toggleTodo, postTodo } from ".";

// Mock API functions
jest.mock(".", () => ({
  removeTodo: jest.fn(),
  patchTodo: jest.fn(),
  toggleTodo: jest.fn(),
  postTodo: jest.fn(),
}));

// Create a QueryClient wrapper
const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useTodoMutations", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deletes a todo and invalidates the todos query", async () => {
    // Mock the API function
    (removeTodo as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useTodoMutations(), {
      wrapper: createWrapper(),
    });

    const queryClient = renderHook(() => useQueryClient(), {
      wrapper: createWrapper(),
    }).result.current;

    // Trigger the mutation
    await act(async () => {
      await result.current.deleteTodoMutation.mutateAsync("todo-id-123");
    });

    // Verify the API was called correctly
    expect(removeTodo).toHaveBeenCalledWith("todo-id-123");

    // Verify the query was invalidated
    await waitFor(() => {
      expect(queryClient.isFetching({ queryKey: ["todos"] })).toBe(0);
    });
  });

  it("adds a todo and invalidates the todos query", async () => {
    const newTodo = { id: "4", text: "New Todo", completed: false };
    (postTodo as jest.Mock).mockResolvedValueOnce(newTodo);

    const { result } = renderHook(() => useTodoMutations(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.addTodoMutation.mutateAsync("New Todo");
    });

    expect(postTodo).toHaveBeenCalledWith("New Todo");

    const queryClient = renderHook(() => useQueryClient(), {
      wrapper: createWrapper(),
    }).result.current;

    await waitFor(() => {
      expect(queryClient.isFetching({ queryKey: ["todos"] })).toBe(0);
    });
  });
  it("toggles a todo and invalidates the todos query", async () => {
    const todo = { id: "1", text: "Buy groceries", completed: false };
    (toggleTodo as jest.Mock).mockResolvedValueOnce({
      ...todo,
      completed: true,
    });

    const { result } = renderHook(() => useTodoMutations(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.toggleTodoMutation.mutateAsync(todo);
    });

    expect(toggleTodo).toHaveBeenCalledWith(todo);

    const queryClient = renderHook(() => useQueryClient(), {
      wrapper: createWrapper(),
    }).result.current;

    await waitFor(() => {
      expect(queryClient.isFetching({ queryKey: ["todos"] })).toBe(0);
    });
  });
});
