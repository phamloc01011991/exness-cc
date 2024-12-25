import axios from 'axios'
const request = axios.create({
  baseURL:import.meta.env.VITE_API_URL+'api',
});

export const setAuth = ()=>{
  const token = JSON.parse(localStorage.getItem("user") || '{}')
  const refreshToken = token.accessToken
  request.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`
}

setAuth()

export default request