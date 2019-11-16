import React, { useState, useEffect } from "react";
import TodoList from "./Todo/TodoList";
import Context from "./context";
import Loader from "./Loader";
import Modal from "./Modal/Modal";

const AddTodo = React.lazy(
  () =>
    new Promise(resolve => {
      resolve(import("./Todo/AddTodo"));
    })
);

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=7")
      .then(response => response.json())
      .then(todos => {
        setTodos(todos);
        setLoading(false);
      });
  }, []);

  function toggleTodo(id) {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      })
    );
  }

  function removeTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  function addTodo(title) {
    setTodos(
      todos.concat([
        {
          title,
          id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
          completed: false
        }
      ])
    );
  }

  return (
    <Context.Provider value={{ removeTodo, toggleTodo }}>
      <div className="wrapper">
        <h1>React tutorial</h1>
        <Modal />
        <React.Suspense fallback={<Loader />}>
          <AddTodo onCreate={addTodo} />
        </React.Suspense>
        {loading && <Loader />}
        {todos.length ? (
          <TodoList todos={todos} />
        ) : loading ? null : (
          <p>Don't have tasks</p>
        )}
      </div>
    </Context.Provider>
  );
}

export default App;
