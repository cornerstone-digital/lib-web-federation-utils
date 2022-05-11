import React from 'react'

// type TodoFormProps = {
//   addTodo: (todo: string) => void
// }

const TodoForm = () => {
  return (
    <div className="todo-input">
      <input type="text" placeholder="What needs to be done?" />
      {/*<button onClick={props.addTodo}>Add</button>*/}
    </div>
  )
}

TodoForm.displayName = 'TodoForm'

export default TodoForm
