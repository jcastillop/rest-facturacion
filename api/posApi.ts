import axios from 'axios';

const posApi = axios.create({
    baseURL: '/api'
});


export default posApi;