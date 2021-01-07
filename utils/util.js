function login () {
  wx.login({
    success (res) {
      if (res.code) {
        wx.request({
          url: 'https://avatar.wendy.fun/api/login',
          method: 'POST',
          data: {
            code: res.code
          },
          success (data) {
            var token = data.data.data.token
            wx.setStorageSync('token',token)
            getApp().globalData.token = token
          }
        })
      }
    }
  })
}

module.exports = {
  login
}
