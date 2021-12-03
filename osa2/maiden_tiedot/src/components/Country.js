import React from 'react'
import Weather from './Weather'

const Country = ({ country }) => {
    return (
        <>
        <h2>{country.name.common}</h2>
        <p>capital {country.capital}</p>
        <p>population {country.population}</p>
        <h3>Spoken languages</h3>
        <ul>
        {Object.values(country.languages).map(language =>
        <li key={language}>{language}</li>)}
        </ul>
        <img src={country.flags.png} width="100" alt="the country's flag"/>
        <h3>Weather in {country.capital}</h3>
        <Weather country={country} />
        </>

    )
}

export default Country