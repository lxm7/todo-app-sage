import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeTodo, patchTodo, toggleTodo, postTodo } from ".";

import type { EditTodoVariables, Todo } from "../components/TodoListItem";

export const useTodoMutations = () => {
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation<void, Error, string>({
    mutationFn: removeTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const editTodoMutation = useMutation<Todo, Error, EditTodoVariables>({
    mutationFn: patchTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const toggleTodoMutation = useMutation<Todo, Error, Todo>({
    mutationFn: toggleTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Mutation for adding a new todo
  const addTodoMutation = useMutation<Todo, Error, string>({
    mutationFn: postTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return {
    deleteTodoMutation,
    editTodoMutation,
    toggleTodoMutation,
    addTodoMutation,
  };
};
