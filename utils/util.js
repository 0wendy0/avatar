import api from 'api'

function login () {
  wx.login({
    success (res) {
      if (res.code) {
        var data = {
          code: res.code
        }
        api.login(data).then((res) => {
          wx.setStorageSync('token', res.data.token)
          getApp().globalData.token = res.data.token
          wx.navigateBack()
        });
      }
    }
  })
}

module.exports = {
  login
}
