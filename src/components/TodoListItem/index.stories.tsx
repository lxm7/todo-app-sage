import type { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CarbonProvider from "carbon-react/lib/components/carbon-provider";
import sageTheme from "carbon-react/lib/style/themes/sage";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import TodoListItem, { Todo } from ".";

const queryClient = new QueryClient();

const sampleTodo: Todo = { id: "1", text: "Buy groceries", completed: false };

const meta: Meta<typeof TodoListItem> = {
  title: "Components/TodoListItem",
  component: TodoListItem,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <CarbonProvider theme={sageTheme}>
          <Story />
        </CarbonProvider>
      </QueryClientProvider>
    ),
  ],
  args: {
    todo: sampleTodo,
  },
};

export default meta;
type Story = StoryObj<typeof TodoListItem>;

/**
 * For these stories we assume that the mutations in the custom hook
 * (useTodoMutations) make HTTP requests to the following endpoints:
 *
 * - DELETE a todo: DELETE "/todos/{id}"
 * - Edit (update) a todo: PUT "/todos/{id}"
 * - Toggle a todo: PATCH "/todos/{id}/toggle"
 *
 * The MSW handlers below simulate both successful and error responses.
 */

// --- Successful operations for Todo with id "1" ---

const successHandlers = [
  http.delete("/todos/1", () => {
    return HttpResponse.json({ message: "Todo deleted successfully" });
  }),
  http.put("/todos/1", async () => {
    // Simulate a successful edit that returns the updated todo.
    return HttpResponse.json({
      id: "1",
      text: "Updated text",
      completed: false,
    });
  }),
  http.patch("/todos/1/toggle", () => {
    // Simulate a successful toggle that flips the completion status.
    return HttpResponse.json({
      id: "1",
      text: "Learn Storybook",
      completed: true,
    });
  }),
];

// --- Successful operations for Todo with id "2" (Completed Todo) ---

const completedHandlers = [
  http.delete("/todos/2", () => {
    return HttpResponse.json({ message: "Todo deleted successfully" });
  }),
  http.put("/todos/2", async () => {
    return HttpResponse.json({
      id: "2",
      text: "Updated text",
      completed: true,
    });
  }),
  http.patch("/todos/2/toggle", () => {
    return HttpResponse.json({
      id: "2",
      text: "Write tests",
      completed: false,
    });
  }),
];

// --- Stories ---

// Default story with an incomplete Todo (id "1") and successful responses.
export const Default: Story = {
  args: {
    todo: { id: "1", text: "Learn Storybook", completed: false },
  },
  parameters: {
    msw: {
      handlers: successHandlers,
    },
  },
};

// Completed Todo story (id "2") with successful responses.
export const Completed: Story = {
  args: {
    todo: { id: "2", text: "Write tests", completed: true },
  },
  parameters: {
    msw: {
      handlers: completedHandlers,
    },
  },
};

const editHandler = http.patch("/todo/1", () => {
  return HttpResponse.json({ sampleTodo });
});

export const EditInteraction: Story = {
  args: {
    todo: sampleTodo,
  },
  parameters: {
    msw: {
      handlers: [editHandler],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Click the Edit button.
    const editButton = await canvas.findByTestId("edit-button-1");
    await userEvent.click(editButton);

    // After clicking "Edit", an edit textbox should appear.
    // Find the textbox (assumes the underlying TextBox renders an input element).
    const editTextbox = await canvas.findByTestId("textbox");
    // Clear the existing text and type a new value.
    await userEvent.clear(editTextbox);
    await userEvent.type(editTextbox, "Buy vegetables");

    // Click the Save button.
    const saveButton = await canvas.findByTestId("save-button-1");
    await userEvent.click(saveButton);

    // Finally, verify that the Edit button is back in the DOM.
    await expect(canvas.findByTestId("edit-button-1")).resolves.toBeDefined();
  },
};
