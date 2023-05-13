import { authOut } from '@redux/authReducer'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { setLoginForm } from '@redux/loginReducer'
import { AppState } from '@redux/store'
import { AnyAction, ThunkAction } from '@reduxjs/toolkit'
import { API_PATHS } from '@utility/API_PATH'
import { DEVICE_ID } from '@utility/constant'
import axios, { AxiosRequestConfig } from 'axios'

function makeid(length) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || ''
}

const generateUrl = (url: string, deviceId) => {
  if (url.includes('?')) return url + `&identity=${deviceId}`
  else return url + `?identity=${deviceId}`
}

const request = axios.create({
  headers: {
    'accept-language': 'vi',
    'Content-Type': 'application/json',
  },
  method: 'get',
})

let isRefreshing = false
let failedQueue: any = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    const originalRequest = err.config
    if (err.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return axios(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      return new Promise(function (resolve, reject) {
        axios
          .post(API_PATHS.users.refreshToken)
          .then(({ data }) => {
            axios.defaults.headers.common['Authorization'] =
              'Bearer ' + data.fooToken
            originalRequest.headers['Authorization'] = 'Bearer ' + data.fooToken
            processQueue(null, data.fooToken)
            resolve(axios(originalRequest))
          })
          .catch((err) => {
            processQueue(err, null)
            reject(err)
          })
          .then(() => {
            isRefreshing = false
          })
      })
    }

    return Promise.reject(err)
  }
)

export const api = (options: AxiosRequestConfig) => {
  return request(options)
}

function fetchThunk(
  options: AxiosRequestConfig,
  requireLogin?: boolean
): ThunkAction<Promise<any>, AppState, null, AnyAction> {
  return async (dispatch, getState) => {
    const isLogin = getState().auth.isLogin
    const loading = getState().auth.loading

    do {
      await new Promise((resolve) => setTimeout(resolve, 250))
      if (!getState().auth.loading || isLogin) {
        break
      }
    } while ((!isLogin && requireLogin) || loading)

    try {
      let deviceId = localStorage.getItem(DEVICE_ID)
      if (!deviceId) {
        deviceId = makeid(20)
        localStorage.setItem(DEVICE_ID, deviceId)
      }

      const json = await api({
        ...options,
        url: options.url && generateUrl(options.url, deviceId),
        headers: {
          'x-csrf': getCookie('X-CSRF-TOKEN') || '',
          ...options.headers,
        },
      })
      return json || {}
    } catch (e: any) {
      const logout = () => {
        dispatch(setLoginForm({ username: '', password: '' }))
        dispatch(authOut())
      }
      if (e.response.status === 401) {
        if (requireLogin) {
          dispatch(setOpenLoginDialog(true))
        }
        logout()
      }
      throw e
    }
  }
}

export default fetchThunk
