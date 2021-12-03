import React from 'react'

const Course = ({ course }) => {
  
    return (
      <>
      <Header course={course} />
      <Content course={course}/>
      <Total course={course} />
      </>
  
    )
  }

const Header = ({ course }) => {
  return (
    <h2>{course.name}</h2>
  )
}
  
const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>    
  )
}
  
const Content = ({ course }) => {
  return (
   <div>
      {course.parts.map(part =>
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}
  
const Total = ({ course }) => {
  const sum = course.parts.reduce( (sum, part) => sum + part.exercises, 0)
    return(
      <p><strong>total of {sum} exercises</strong></p>
    ) 
}



export default Course