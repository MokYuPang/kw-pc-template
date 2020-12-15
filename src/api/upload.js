import axios from '@/utils/axios'

/**
 * 文件上传
 * @param {Object} params 
 */
export function avatar (params = {}) {
  let data = {
    ...params
  }
  const formdata = new FormData()
  Object.keys(data).forEach(key => {
    formdata.append(key, data[key])
  })
  return axios({
    url: '/Member/avatar',
    method: 'post',
    data: formdata,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}