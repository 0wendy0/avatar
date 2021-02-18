import api from '../../utils/api'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';


Page({
  data: {
    page: 1,
    pageSize: 20,
    scrollHeight: 0,
    list: []
  },
  onLoad: function (options) {
    var windowHeight = wx.getSystemInfoSync().windowHeight
    this.setData({
      scrollHeight: windowHeight
    })
    this.getPageData()
  },
  onShow: function () {
  },
  getPageData() {
    var data = {
      page: this.data.page,
      pageSize: this.data.pageSize
    }
    api.starList(data).then((res)=>{
      var list = this.data.list
      res.data.list.forEach(item => {
        list.push(item)
      })
      this.setData({
        list: list
      })
    })
  },
  deleteItem(event) {
    var index = event.currentTarget.dataset.index
    var _this = this
    Dialog.confirm({
      title: "确定删除吗？"
    }).then(() => {
      var item = _this.data.list[index]
      api.cardDisStar({ "id": item.card_id }).then(res => {
        _this.data.list.splice(index,1)
        _this.setData({
          list: _this.data.list
        })
      })
    }).catch(()=>{
    })
  },
  toCardDetail(event) {
    var data = event.currentTarget.dataset
    var url = '/pages/card/detail?id=' + data.card_id + '&title=' + data.title
    wx.navigateTo({
      url: url
    })
  }
})