/* eslint-disable */
/* tslint:disable */
import type { Meta, StoryObj, StoryFn } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";

import TodoList from ".";

// const meta = {
//   title: 'Example/Button',
//   component: Button,
//   parameters: {
//     // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
//     layout: 'centered',
//   },
//   // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
//   tags: ['autodocs'],
//   // More on argTypes: https://storybook.js.org/docs/api/argtypes
//   argTypes: {
//     backgroundColor: { control: 'color' },
//   },
//   // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
//   args: { onClick: fn() },
// } satisfies Meta<typeof Button>;

// export default meta;
// type Story = StoryObj<typeof meta>;

// // More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
// export const Primary: Story = {
//   args: {
//     primary: true,
//     label: 'Button',
//   },
// };

const meta = {
  title: "components/TodoList",
  component: TodoList,
  decorators: [
    (Story) => (
      <QueryClientProvider client={new QueryClient()}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get("/todos", () => {
          return HttpResponse.json([
            { id: "1", text: "Initial todo", completed: false },
            { id: "2", text: "Completed todo", completed: true },
          ]);
        }),
        http.post("/todos", async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({
            id: "3",
            text: (body as { text: string }).text,
            completed: false,
          });
        }),
      ],
    },
  },
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/todos", async () => {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [http.get("/todos", () => HttpResponse.json([]))],
    },
  },
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/todos", () => new HttpResponse(null, { status: 500 })),
      ],
    },
  },
};

export const Success: Story = {};

export const AddTodoInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test adding new todo
    const input = canvas.getByLabelText("New Todo");
    await userEvent.type(input, "New storybook todo");
    await userEvent.click(canvas.getByRole("button", { name: "Add Todo" }));

    // Verify the new todo appears
    await expect(
      canvas.findByText("New storybook todo")
    ).resolves.toBeInTheDocument();
  },
};

export const EditTodoInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click edit button on first todo
    const editButtons = await canvas.findAllByRole("button", { name: "Edit" });
    await userEvent.click(editButtons[0]);

    // Update text and save
    const editInput = await canvas.findByRole("textbox");
    await userEvent.clear(editInput);
    await userEvent.type(editInput, "Updated todo text");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));

    // Verify update
    await expect(
      canvas.findByText("Updated todo text")
    ).resolves.toBeInTheDocument();
  },
};

export const ToggleTodoInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Get first checkbox
    const checkbox = await canvas.findByRole("checkbox", {
      name: "Initial todo",
    });

    // Toggle state
    await userEvent.click(checkbox);

    // Verify visual state change
    await expect(checkbox).toBeChecked();
  },
};
