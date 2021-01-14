import api from '../../utils/api'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    cardId: 0,
    currentIndex: 0,
    currentImage: '',
    height: '300px',
    detail: null,
    fileList: [],
    isLike: false,
    isStar: false,
    likeCount: 0,
    starCount: 0
  },
  onLoad: function (options) {
    this.goheight()
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
    api.cardDetail(data).then(res => {
      var isLike = res.data.detail.like_time ? true : false
      var isStar = res.data.detail.star_time ? true : false
      this.setData({
        detail: res.data.detail,
        fileList: res.data.detail.file,
        currentImage: res.data.detail.file[this.data.currentIndex].url,
        isLike: isLike,
        isStar: isStar,
        likeCount: res.data.detail.like_count,
        starCount: res.data.detail.star_count
      })
    }, err => {
      wx.navigateBack()
    })
  },
  goheight (e) {
    var width = wx.getSystemInfoSync().screenWidth
    var height = (width - 20) + 'px'
    this.setData({
      height: height
    })
  },
  saveImage () {
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
    Toast.loading({
      duration: 0,
      message: '加载中...',
      forbidClick: true,
      mask: true
    })
    wx.getImageInfo({
      src: this.data.currentImage,
      success (res) {
        var url = res.path
        wx.saveImageToPhotosAlbum({
          filePath: url,
          success (res) {
            Toast.success('保存成功')
          },
          fail (res) {
            Toast.fail('保存失败')
          }
        })
      },
      fail (res) {
        Toast.fail('保存失败')
      }
    })
  },
  cardLike () {
    api.cardLike({ "id": this.data.cardId }).then(res => {
      var likeCount = this.data.likeCount + 1
      this.setData({
        isLike: true,
        likeCount: likeCount
      })
    })
  },
  cardDisLike () {
    api.cardDisLike({ "id": this.data.cardId }).then(res => {
      var likeCount = this.data.likeCount - 1
      this.setData({
        isLike: false,
        likeCount: likeCount
      })
    })
  },
  cardStar () {
    api.cardStar({ "id": this.data.cardId }).then(res => {
      var starCount = this.data.starCount + 1
      this.setData({
        isStar: true,
        starCount: starCount
      })
    })
  },
  cardDisStar () {
    api.cardDisStar({ "id": this.data.cardId }).then(res => {
      var starCount = this.data.starCount - 1
      this.setData({
        isStar: false,
        starCount: starCount
      })
    })
  },
  clickImg (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentIndex: index,
      currentImage: this.data.fileList[index].url
    })
  }
})