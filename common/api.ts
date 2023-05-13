import axios, { AxiosRequestConfig } from 'axios'

const request = axios.create({
  headers: {
    'accept-language': 'vi',
    'Content-Type': 'application/json',
  },
  method: 'get',
})

const api = (options: AxiosRequestConfig) => {
  return request(options)
}

export default api
