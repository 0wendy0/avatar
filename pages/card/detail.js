import api from '../../utils/api'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    cardId: 0,
    index: 0,
    height: '300px',
    fileList: []
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title 
    })
    this.setData({
      cardId: options.id
    })
    this.getPageData()
  },
  getPageData() {
    var data = {
      cardId: this.data.cardId
    }
    api.cardDetail(data).then((res)=>{
      this.setData({
        fileList: res.data.detail.file
      })
    })
  },
  goheight:function (e) {
    var width = wx.getSystemInfoSync().windowWidth
    //获取可使用窗口宽度
    var imgheight = e.detail.height
    //获取图片实际高度
    var imgwidth = e.detail.width
    //获取图片实际宽度
    var height = width * imgheight / imgwidth +"px"
    //计算等比swiper高度
    this.setData({
      height: height
    })
  },
  saveImage(){
    var _this = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success () {
              _this.saveToPhone()
            },
            fail () {
              Toast.fail('无权限')
            }
          })
        } else {
          _this.saveToPhone()
        }
      }
    })
  },
  saveToPhone () {
    this.data.fileList.forEach((item, index)=>{
      if (this.data.index === index) {
        var url = item.url
        wx.getImageInfo({
          src: url,
          success (res) {
            url = res.path
            wx.saveImageToPhotosAlbum({
              filePath: url,
              success (res) {
                Toast.success('保存成功')
              },
              fail (res) {
                Toast.fail('保存失败')
              }
            })
          }
        })
      }
    })
  },
  imgChane (res) {
    this.setData({
      index: res.detail.current
    })
  }
})