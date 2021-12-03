import axios from 'axios'
const baseUrl = 'https://restcountries.com/v3.1/all'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getWeather = country => {
    const api_key = process.env.REACT_APP_API_KEY
  
    const params = {
      access_key: `${api_key}`,
      query: `${country.country.capital}`
    }

    const request = axios.get('http://api.weatherstack.com/current', {params})
    return request.then(response => response.data)
}

const services = {
    getAll, getWeather
}



export default services