import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3032;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (todo: Todo) => {
  return client.post<Todo[]>(`/todos?userId=${USER_ID}`, todo);
};

// Add more methods here
