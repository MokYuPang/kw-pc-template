import axios from 'axios'
import qs from 'qs'


// 网络出错时调用
const requestError = (err) => {
  let errorText = ''
  if (err.response && err.response.status) {
    errorText = '请求错误：' + err.response.status + ',' + err.response.statusText
  }
  if (/Error/.test(err)) {
    errorText = '请求超时'
  }
  
  console.log('error:', errorText)
}

axios.defaults.timeout = 30 * 1000
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = ''
axios.defaults.headers.common['Authorization'] = ''

// request拦截器
axios.interceptors.request.use(config => {
  if (config.data instanceof FormData) {
    return config
  }
  if (config.method === 'post' && data) {
    config.data = qs.stringify(config.data)    
  }
  return config
}, err => {
  return Promise.reject(err)
})

// response拦截器
axios.interceptors.response.use(rs => {
  return rs
}, err => {
  console.log(['response error:'], err)
  requestError(err)
})

export default function(options) {
  if (!options) {
    return
  }
  let config = {
    url: options.url,
    method: options.method
  }

  if (options.method === 'get') {
    config.params = options.data
  }

  if (options.method === 'post') {
    config.data = options.data
    // 文件上传头部信息
    if (config.data instanceof FormData) {
      config.headers = options.headers
    }
  }

  return new Promise((resolve, reject) => {
    axios(config).then((rs) => {
      resolve(rs.data)
    }, (err) => {
      reject(err)
    }).catch((err) => {
      reject(err)
    })
  })
}

