import { http, HttpResponse } from "msw";
import { v4 as uuidv4 } from "uuid";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// Initial in-memory list of todos
let todos: Todo[] = [
  { id: "1", text: "Buy groceries", completed: false },
  { id: "2", text: "Walk the dog", completed: true },
];

export const handlers = [
  // GET /api/todos
  // http.get("/api/todos", (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.json(todos));
  // }),
  http.get("/api/todos", () => {
    return HttpResponse.json({
      id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d",
      firstName: "John",
      lastName: "Maverick",
    });
  }),

  // POST /api/todos
  // http.post("/api/todos", async (req, res, ctx) => {
  //   const { text } = await req.json();
  //   if (!text) {
  //     return res(ctx.status(400), ctx.json({ error: "Text is required" }));
  //   }

  //   const newTodo: Todo = {
  //     id: uuidv4(),
  //     text,
  //     completed: false,
  //   };
  //   todos.push(newTodo);
  //   return res(ctx.status(201), ctx.json(newTodo));
  // }),

  // // DELETE /api/todos/:todoId
  // http.delete("/api/todos/:todoId", (req, res, ctx) => {
  //   const { todoId } = req.params;
  //   todos = todos.filter((todo) => todo.id !== todoId);
  //   return res(ctx.status(200), ctx.json({ id: todoId }));
  // }),
];
