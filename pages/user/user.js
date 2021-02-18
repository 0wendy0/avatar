import api from '../../utils/api'

const app = getApp()

Page({
  data: {
    userInfo: {
      avatar: '',
      nickname: ''
    },
    hasUserInfo: false
  },
  onLoad: function () {
    api.userInfo().then((res) => {
      if(res.data.avatar && res.data.nickname) {
        this.setData({
          userInfo: res.data,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo: function(e) {
    if(e.detail.userInfo) {
      let userInfo = {
        avatar: e.detail.userInfo.avatarUrl,
        nickname: e.detail.userInfo.nickName
      }
      api.userSet(userInfo).then((res) => {
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true
        })
      })
    }
  }
})
