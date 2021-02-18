import api from '../../utils/api'
import util from '../../utils/util'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    cardId: 0,
    currentIndex: 0,
    currentImage: '',
    height: '300',
    height: '300',
    detail: null,
    fileList: [],
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
  },
  onShow: function () {
    this.getPageData()
  },
  getPageData() {
    var data = {
      cardId: this.data.cardId
    }
    api.cardDetail(data).then(res => {
      var isStar = res.data.detail.star_time ? true : false
      this.setData({
        detail: res.data.detail,
        fileList: res.data.detail.file,
        currentImage: res.data.detail.file[this.data.currentIndex].url,
        isStar: isStar,
        likeCount: res.data.detail.like_count,
        starCount: res.data.detail.star_count
      })
    }, err => {
      wx.navigateBack()
    })
  },
  goheight (e) {
    var width = wx.getSystemInfoSync().screenWidth - 20
    this.setData({
      width: width,
      height: width
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
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2] 
      if(prevPage.route === 'pages/user/starList') {
        var list = prevPage.data.list
        var now = new Date()
        var data = {
          avatar: this.data.detail.user.avatar,
          card_id: this.data.cardId,
          cover_image: this.data.detail.cover_image,
          created_at: this.data.detail.created_at,
          id: null,
          like_count: this.data.likeCount,
          nickname: this.data.detail.user.nickname,
          star_count: starCount,
          star_time: util.formatDate(now, "yyyy-mm-dd hh:mi:ss"),
          title: this.data.detail.title
        }
        list.unshift(data)
        prevPage.setData({
          list: list
        })
      }
    })
  },
  cardDisStar () {
    api.cardDisStar({ "id": this.data.cardId }).then(res => {
      var starCount = this.data.starCount - 1
      this.setData({
        isStar: false,
        starCount: starCount
      })
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2] 
      if(prevPage.route === 'pages/user/starList') {
        var list = prevPage.data.list
        list.forEach((item, index) => {
          if(item.card_id == this.data.cardId) {
            list.splice(index, 1)
          }
        })
        prevPage.setData({
          list: list
        })
      }
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