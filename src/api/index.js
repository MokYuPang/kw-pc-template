import axios from '@/utils/axios'

export function productIndexLists (params = {}) {
  let data = {
    ...params
  }
  return axios({
    url: '/Index/productIndexLists',
    method: 'get',
    data: data
  })
}