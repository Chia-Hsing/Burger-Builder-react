import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://react-my-buger-7137c.firebaseio.com/'
})

export default instance
