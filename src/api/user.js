import axios from '@/utils/axios'

export function login (params = {}) {
  let data = {
    ...params
  }
  return axios({
    url: '/User/login',
    method: 'post',
    data: data
  })
}