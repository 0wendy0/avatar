import util from './utils/util'

App({
  onLaunch: function () {
    var token = wx.getStorageSync('token')
    this.globalData.token = token
  },
  globalData: {
    token: ''
  }
})