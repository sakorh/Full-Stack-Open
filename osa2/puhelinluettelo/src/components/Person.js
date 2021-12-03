import React from 'react'

const Person = ({ person, deleteName }) => {
    return (
      <><p>
        {person.name} {person.number}
          <button onClick={deleteName}>delete</button>
        </p>
      </>
    )
  }

export default Person