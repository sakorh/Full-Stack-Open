import React from 'react'


const Filter = ({ newFilter, filterNames }) => {

    return (
        <div>
          filter shown with
          <input 
          value={newFilter}
          onChange={filterNames}/>
        </div>
    )

}

export default Filter