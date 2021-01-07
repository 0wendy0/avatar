const util = require('./utils/util.js')

App({
  onLaunch: function () {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.checkSession({
        success (){
          getApp().globalData.token = token
          console.log('session key 未过期')
        },
        fail () {
          util.login()
        }
      })
    } else {
      util.login()
    }

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    token: ''
  }
})