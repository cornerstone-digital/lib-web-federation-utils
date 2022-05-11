import React from 'react'
import ReactDOM from 'react-dom'

import TodoForm from './federated/components/TodoForm/TodoForm'
import { createFederatedReact } from '@vf/federated-web-react'
import { getFederatedRuntime } from '@vf/federated-web-core'

export const TodoApp = () => {
  // const [todos, setTodos] = useState([
  //   {
  //     completed: false,
  //     id: 1,
  //     text: 'Learn Vite',
  //   },
  //   {
  //     completed: false,
  //     id: 2,
  //     text: 'Learn Vite',
  //   },
  // ])

  // const addTodo = text => {
  //   const newTodos = [...todos, { completed: false, id: Date.now(), text }]
  //   setTodos(newTodos)
  // }

  // const completeTodo = id => {
  //   const newTodos = todos.map(todo => {
  //     if (todo.id === id) {
  //       return { ...todo, completed: !todo.completed }
  //     }
  //     return todo
  //   })
  //   setTodos(newTodos)
  // }

  // const removeTodo = id => {
  //   const newTodos = todos.filter(todo => todo.id !== id)
  //   setTodos(newTodos)
  // }

  return (
    <div className="todo-app">
      <h1>Todo App Example</h1>
      {/*<TodoList todos={todos} completeTodo={completeTodo} removeTodo={removeTodo} />*/}
      <TodoForm />
    </div>
  )
}

export default createFederatedReact({
  React,
  ReactDOM,
  config: {
    activeWhenPaths: ['/'],
    domElementId: 'root2',
    name: 'MainApp2',
    rootComponent: TodoApp,
    scope: 'to-do',
  },
  federatedRuntime: getFederatedRuntime(),
})
