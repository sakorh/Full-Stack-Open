import React, { useEffect, useState } from 'react'
import countryService from './services/countries.js'
import Filter from './components/Filter'
import Countries from './components/Countries'

const App = () => {

  const [ countries, setCountries ] = useState([])
  const [ newFilter, setNewFilter ] = useState('')

  useEffect(() => {
    countryService
      .getAll()
      .then(countries => {
        setCountries(countries)
      })
  }, [])


  const filterCountries = (event) => {
    setNewFilter(event.target.value)
  }

  const showInformation = (country) => {
    setNewFilter(country.name.common)
  }

  const countriesToShow = newFilter
   ? countries.filter(country => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))
   : countries

  return (
    <div>
      <Filter newFilter={newFilter} filterCountries={filterCountries}/>
      <Countries countriesToShow={countriesToShow} showInformation={showInformation} /> 
    </div>
  )
}


export default App
