import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import { message } from 'antd';

const http = axios.create({
  timeout: 10000,
  baseURL: 'http://localhost:7001'
})

// 请求拦截
// 每一次发请求之前做的事情
http.interceptors.request.use((config: AxiosRequestConfig) => {
  // 请求头加上token
  // token: 后端签发的令牌 一般情况下是登录成功之后
  // token是根据用户信息生成的
  // token是有过期时间的
  let token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, (err: AxiosError) => {
  return Promise.reject(err)
})

http.interceptors.response.use((res: any) => {
  return res.data
}, (err: any) => {
  const status: number = err.response! && err.response.status
  if (status === 401) {
    message.error('登录过期')
  }
  if (status === 403) {
    message.error('没有权限')
  }
  if (status === 404) {
    message.error('路径错误')
  }
  if (status === 500) {
    message.error('服务器错误')
  }
  if (status === 503) {
    message.error('服务器维护')
  }
  return Promise.reject(err)
})


export default http