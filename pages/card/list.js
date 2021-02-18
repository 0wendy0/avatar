import api from '../../utils/api'

Page({
  data: {
    categoryId: 0,
    page: 1,
    pageSize: 20,
    cardList: []
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title 
    })
    this.setData({
      categoryId: options.id
    }),
    this.getPageData()
  },
  getPageData() {
    var data = {
      categoryId: this.data.categoryId,
      page: this.data.page,
      pageSize: this.data.pageSize
    }
    api.cardList(data).then((res)=>{
      var cardList = this.data.cardList
      res.data.list.forEach(item => {
        var date = item.created_at
        date = date.replace(/\-/g, '/')
        date = new Date(date)
        item.dateTime = (date.getMonth() + 1) + '月' + date.getDate() + '日'
        cardList.push(item)
      })
      this.setData({
        cardList: cardList
      })
    })
  },
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    })
    this.getPageData()
  }
})
