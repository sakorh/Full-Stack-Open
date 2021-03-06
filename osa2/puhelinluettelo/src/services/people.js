import axios from 'axios'
const baseUrl = '/api/people'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const deleteName = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const services = {
    getAll, create, deleteName, update
}



export default services