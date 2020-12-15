module.exports = {
  proxy: {
    target: 'http://test.cn.keywa.cc',
    table: [
      '/Index'
    ]
  },
  
  proxyUser: {
    target: 'http://user.test.cn.keywa.cc',
    table: [
      '/User', '/Member'
    ]
  }
}