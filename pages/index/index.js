import api from '../../utils/api'

Page({
  data: {
    categoryParentList: [],
    categoryList: [],
    activeKey: 0,
  },
  onLoad: function () {
  },
  onShow: function () {
    api.categoryList({"pid": 0}).then((res)=>{
      this.setData({
        categoryParentList: res.data.list
      })
      this.getCategoryList()
    })
  },
  categoryChange (event) {
    if(event.detail !== this.data.activeKey){
      this.setData({
        activeKey: event.detail
      })
      this.getCategoryList()
    }
  },
  getCategoryList () {
    var pid = 0
    this.data.categoryParentList.forEach((item, index) => {
      if(index === this.data.activeKey){
        pid = item.id
      }
    })
    api.categoryList({"pid": pid}).then((res)=>{
      this.setData({
        categoryList: res.data.list
      })
    })
  }
})
