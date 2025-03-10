import { http, HttpResponse } from "msw";
import { v4 as uuidv4 } from "uuid";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type TodoTextInput = Pick<Todo, "text">;

// Initial in-memory list of todos
let allTodos: Map<string, Todo> = new Map<string, Todo>([
  ["1", { id: "1", text: "Buy groceries", completed: false }],
  ["2", { id: "2", text: "Walk the dog", completed: true }],
  ["2", { id: "3", text: "Code project", completed: true }],
]);

export const handlers = [
  http.get("/favicon.ico", ({ request }) => {
    return HttpResponse.text("", { status: 200 });
  }),
  http.get("/todos", () => {
    return HttpResponse.json(Array.from(allTodos.values()));
  }),
  http.post("/todos", async ({ request }) => {
    const { text } = (await request.json()) as TodoTextInput;

    // Create a new todo object with a generated UUID.
    const newTodo: Todo = {
      id: uuidv4(),
      text,
      completed: false,
    };
    // Push the new todo item to the map of all posts.
    allTodos.set(newTodo.id, newTodo);
    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created post!
    return HttpResponse.json(newTodo, { status: 201 });
  }),
  http.delete("/todo/:id", ({ params }) => {
    // All request path params are provided in the "params"
    // argument of the response resolver.
    const { id } = params;

    // Let's attempt to grab the post by its ID.
    const deletedTodo = allTodos.get(id as string);

    // Respond with a "404 Not Found" response if the given
    // Todo ID does not exist.
    if (!deletedTodo) {
      return new HttpResponse(null, { status: 404 });
    }

    // Delete the Todo from the "allTodos" map.
    allTodos.delete(id as string);

    // Respond with a "200 OK" response and the deleted Todo.
    return HttpResponse.json(deletedTodo);
  }),
  http.patch("/todo/:id", async ({ request, params }) => {
    const { id } = params;
    // Type-assert the JSON payload as an update to the Todo.
    const updateData = (await request.json()) as TodoTextInput;

    const existingTodo = allTodos.get(id as string);
    if (!existingTodo) {
      return new HttpResponse(null, { status: 404 });
    }

    // Merge the update data with the existing todo.
    const updatedTodo: Todo = {
      ...existingTodo,
      ...updateData,
    };

    allTodos.set(id as string, updatedTodo);
    return HttpResponse.json(updatedTodo);
  }),
];
