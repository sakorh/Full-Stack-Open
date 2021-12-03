import React from 'react'
import Person from './Person'


const People = ({ namesToShow, deleteName }) => {

    return (
        <div>
            {namesToShow.map(person =>
        <Person key={person.id} person={person} deleteName={() => deleteName(person.id)}/>)}
        </div>

    )
}

export default People