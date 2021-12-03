import React, { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import People from './components/People'
import personService from './services/people'

const Notification = ({ success, error }) => {
  if (success === null && error === null) {
    return null
  } else if (error === null) {
    return (
      <div className="success">
        {success}
      </div>
    )
  } else {
    return (
      <div className="error">
        {error}
      </div>
    )
  }

}

const App = () => {

  const [ people, setPeople ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPeople => {
        setPeople(initialPeople)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    if (people.map(person => person.name.toLowerCase()).includes(newName.toLowerCase())) {
      const person = people.find(p => p.name.toLowerCase() === newName.toLowerCase())
      if (person.number === newNumber) {
        window.alert(`${newName} is already added to phonebook`)
      } else  if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)){
        const personObject = {
          name: person.name,
          number: newNumber
        }

        personService
          .update(person.id, personObject)
          .then(returnedPerson => {
            setPeople(people.map(p => p.id !== returnedPerson.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            setSuccessMessage(
              `Updated ${returnedPerson.name}'s number'`
              )
              setTimeout(() => {
                setSuccessMessage(null)
              }, 5000)
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${person.name} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPeople(people.filter(p => p.id !== person.id))
          })
      }
      
    }else {

      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPeople(people.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(
            `Added ${returnedPerson.name}`
            )
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
        })
    }
  }

  const deleteName = (id) => {
    const person = people.find(p => p.id === id)

    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
      .deleteName(id)
      .then(() => {
        setPeople(people.filter(p => p.id !== id))
        setSuccessMessage(
          `Deleted ${person.name}`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
      })
    }
  }


  const filterNames = (event) => {
    setNewFilter(event.target.value)
  }

  const namesToShow = newFilter
    ? people.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
    : people


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification success={successMessage} error={errorMessage}/>
      <Filter newFilter={newFilter} filterNames={filterNames} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <People namesToShow={namesToShow} deleteName={deleteName}/>
    </div>
  )

}

export default App
