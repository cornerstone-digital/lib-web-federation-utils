import React from 'react'
import ReactDOM from 'react-dom'

import TodoForm from './federated/components/TodoForm/TodoForm'
import { createFederatedReact } from '@vf/federated-web-react'
import { getFederatedRuntime } from '@vf/federated-web-core'

export const TodoApp = () => {
  return (
    <div className="todo-app">
      <h1>Todo App Example (/test)</h1>
      {/*<TodoList todos={todos} completeTodo={completeTodo} removeTodo={removeTodo} />*/}
      <TodoForm />
    </div>
  )
}

export default createFederatedReact({
  React,
  ReactDOM,
  config: {
    activeWhenPaths: ['/', '/test'],
    domElementId: 'root2',
    name: 'MainApp2',
    rootComponent: TodoApp,
    scope: 'to-do',
  },
  federatedRuntime: getFederatedRuntime(),
})
