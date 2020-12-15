import { login } from '@/api/user'

class Login {
  constructor() {
    this.init()
  }
  init() {
    this.submit()
  }
  submit() {
    $('.btn').on('click', function(e) {
      login({
        username: $('input[name="username"]').val(),
        password: $('input[name="password"]').val()
      })
    })
  }
}

new Login()