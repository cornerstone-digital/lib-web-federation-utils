import TodoForm from './TodoForm'
import React from 'react'
import ReactDOM from 'react-dom'
import createFederatedReact from '@vf/federated-web-react/helpers/createFederatedReact'

export default createFederatedReact({
  React,
  ReactDOM,
  config: {
    activeWhenPaths: ['/todos/new'],
    domElementId: 'todo-input',
    name: 'TodoForm',
    rootComponent: TodoForm,
    scope: 'ToDoApp',
  },
})
