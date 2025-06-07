import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, getTodos, USER_ID } from './api/todos';
import { UserTodosList } from './UserTodosList';
import { Todo } from './types/Todo';
import { ErrorMessage } from './ErrorMessage';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [newTodo, setNewTodo] = useState<string>('');
  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  const clearError = () => {
    setError('');
  };

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data ?? null);
      })
      .catch(() => setError('load'));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setNewTodo(newTodo);

    const newTodoObject: Todo = {
      userId: USER_ID,
      title: newTodo,
      completed: false,
      id: todos !== null ? todos.length + 1 : 1,
    };

    if (newTodo.trim().length === 0) {
      setError('empty title');
    } else {
      if (todos) {
        setTodos([...todos, newTodoObject]);
      } else {
        setTodos([newTodoObject]);
      }

      addTodos(newTodoObject).catch(() => setError('add'));
    }

    setNewTodo('');
  };

  const checkTodo = (todoId: number) => {
    setTodos(
      prev =>
        prev?.map(todo =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
        ) ?? null,
    );
  };

  const checkAllTodos = () => {
    const newCheckedAll = !checkedAll;

    setCheckedAll(newCheckedAll);
    setTodos(
      prev =>
        prev?.map(todo => ({ ...todo, completed: newCheckedAll })) ?? null,
    );
  };

  const handleFilter = (): Todo[] | null => {
    if (!todos) {
      return null;
    }

    if (filter === 'active') {
      return todos.filter(t => !t.completed);
    }

    if (filter === 'completed') {
      return todos.filter(t => t.completed);
    }

    return todos;
  };

  const finalTodos: Todo[] | null = handleFilter();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
            onClick={() => checkAllTodos()}
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <UserTodosList todos={finalTodos} onChecked={checkTodo} />
        </section>

        {todos && todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos
                ? todos.filter(todo => !todo.completed).length + ' items left'
                : ''}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames({
                  filter__link: true,
                  selected: filter === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames({
                  filter__link: true,
                  selected: filter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames({
                  filter__link: true,
                  selected: filter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <ErrorMessage error={error} onClear={clearError} />
    </div>
  );
};
