import React from 'react'

const Filter = ({ newFilter, filterCountries }) => {

    return (
        <div>
          find countries
          <input 
          value={newFilter}
          onChange={filterCountries}/>
          </div>
    )
}

export default Filter