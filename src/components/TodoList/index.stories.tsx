import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { delay, http, HttpResponse } from "msw";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import CarbonProvider from "carbon-react/lib/components/carbon-provider";
import sageTheme from "carbon-react/lib/style/themes/sage";

import TodoList from ".";
import { Todo } from "../TodoListItem";

const queryClient = new QueryClient();

// Mock data (mutable array)
let sampleTodos: Todo[] = [
  { id: "1", text: "Buy groceries", completed: false },
  { id: "2", text: "Walk the dog", completed: true },
  { id: "3", text: "Read a book", completed: false },
];

// Meta configuration for Storybook
const meta: Meta<typeof TodoList> = {
  title: "Components/TodoList",
  component: TodoList,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <CarbonProvider theme={sageTheme}>
          <Story />
        </CarbonProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;

// Story for Adding a Todo
export const AddTodo: StoryObj<typeof TodoList> = {
  parameters: {
    msw: {
      handlers: [
        // Mock the GET /todos endpoint to return the current list of todos
        http.get("/todos", () => {
          return HttpResponse.json(sampleTodos);
        }),

        // Mock the POST /todos endpoint to simulate adding a new todo
        http.post("/todos", async ({ request }) => {
          await delay(500);

          // Parse the request body
          const { text } = (await request.json()) as { text: string };

          // Create a new todo
          const newTodo: Todo = {
            id: String(sampleTodos.length + 1), // Generate a new ID
            text,
            completed: false,
          };

          // Add the new todo to the list
          sampleTodos.push(newTodo);

          // Return the new todo
          return HttpResponse.json(newTodo);
        }),

        // Mock the DELETE /todos/:id endpoint to simulate deleting a todo
        http.delete("/todo/:id", async ({ params }) => {
          await delay(500);

          // Extract the todo ID from the URL
          const { id } = params;

          // Remove the todo from the list
          sampleTodos = sampleTodos.filter((todo) => todo.id !== id);

          // Return a success response
          return HttpResponse.json({ success: true });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the input and add a new todo
    const input = await canvas.findByLabelText("New Todo");
    await userEvent.type(input, "New Todo");

    // Click the "Add Todo" button
    const addButton = await canvas.findByRole("button", { name: /Add Todo/i });
    await userEvent.click(addButton);

    // Verify that the new todo appears in the list
    const newTodo = await canvas.findByText("New Todo");
    expect(newTodo).toBeInTheDocument();
  },
};

// Story for Deleting a Todo
export const DeleteTodo: StoryObj<typeof TodoList> = {
  parameters: {
    msw: {
      handlers: [
        // Mock the GET /todos endpoint to return the current list of todos
        http.get("/todos", () => {
          return HttpResponse.json(sampleTodos);
        }),

        // Mock the DELETE /todos/:id endpoint to simulate deleting a todo
        http.delete("/todo/:id", async ({ params }) => {
          await delay(500);

          // Extract the todo ID from the URL
          const { id } = params;

          // Remove the todo from the list
          sampleTodos = sampleTodos.filter((todo) => todo.id !== id);

          // Return a success response
          return HttpResponse.json({ success: true });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the Delete button for the todo
    const deleteButton = await canvas.findByTestId("delete-button-2");

    // Click the Delete button
    await userEvent.click(deleteButton);

    // Wait for the item to disappear
    await canvas.findByText("Walk the dog").catch(() => {});

    // Verify that the todo is removed from the list
    await waitFor(async () => {
      await expect(canvas.queryByText("Walk the dog")).not.toBeInTheDocument();
    });
  },
};
