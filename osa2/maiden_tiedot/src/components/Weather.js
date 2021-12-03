import React, { useState } from 'react'
import countryService from '../services/countries'

const Weather = (country) => {

  
    const [ temperature, setTemperature ] = useState('')
    const [icon, setIcon ] = useState([])
    const [ wind, setWind ] = useState('')


    countryService
      .getWeather(country)
      .then(apiResponse => {
        setTemperature(apiResponse.current.temperature)
      setIcon(apiResponse.current.weather_icons)
      setWind(`${apiResponse.current.wind_speed} mph direction ${apiResponse.current.wind_dir}`)
      }).catch(error => {
        console.log(error)
    })
  
    return (
      <>
      <p><strong>temperature: </strong>{temperature} Celcius</p>
      <img src={icon[0]} alt="weather icon"/>
      <p><strong>wind: </strong>{wind}</p>
      </>
    )
  }

  export default Weather