import React from 'react'
import Country from './Country'

const Countries = ({ countriesToShow, showInformation }) => {


    if (countriesToShow.length > 1 && countriesToShow.length < 11) {
        return (
            <div>
                {countriesToShow.map(country => 
                <div key={country.name.common}><ul>{country.name.common}
                <button onClick={() => showInformation(country)}>show</button></ul></div>)}
            </div>
        )
    } else if (countriesToShow.length === 1) {
        return (
            <Country key={countriesToShow[0].area} country={countriesToShow[0]} />
        )
    } else if (countriesToShow.length > 10 && countriesToShow.length < 250) {
        return (
            <p>Too many matches, specify another filter</p>
        )
    } else {
        return null
    }

}

export default Countries
