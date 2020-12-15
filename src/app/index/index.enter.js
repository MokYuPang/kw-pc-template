import { productIndexLists } from '@/api/index'
import { avatar } from '@/api/upload'
import { baseUrl } from '@/utils/config'

class Login {
  constructor() {
    this.init()
  }
  init() {
    this.productIndexLists()
    this.fileChange()
  }
  /**
   * 文件上传
   */
  fileChange() {
    $('#file').on('change', (e) => {
      avatar({
        file: e.target.files[0],
        ...e.target.files[0]
      }).then(rs => {
        $('#file-img')[0].src = `${baseUrl}${rs.data[0].url}`
      })
    })
  }
  /**
   * 获取产品列表
   */
  productIndexLists() {
    productIndexLists().then(res => {
      $('#render-data').text(res.data)
    })
  }
}

new Login()