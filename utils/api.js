import Toast from '../miniprogram_npm/@vant/weapp/toast/toast';

const base = {
  host:'https://avatar.wendy.fun/'
}

const needLoginCode = [1000, 1001, 1002, 1003]

function request(url, method, data) {
  Toast.loading({
    duration: 0,
    message: '加载中...',
    forbidClick: true,
    mask: true
  })
  var app = getApp()
  var url = base.host + url
  var token = 'Bearer ' + app.globalData.token
  var header = {
    'Authorization': token
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success (request) {
        Toast.clear()
        if(request.statusCode !== 200) {
          Toast.fail('请求失败')
          return reject(request.data.msg)
        }
        var code = request.data.code
        if(code !== 0) {
          if(needLoginCode.includes(code)) {
            wx.setStorageSync('token', '')
            wx.navigateTo({
              url: '/pages/login/login'
            })
          } else {
            Toast.fail(request.data.msg)
          }
          return reject(request.data.msg)
        }
        return resolve(request.data)
      },
      fail (error) {
        Toast.fail(error.msg)
        return reject(error.msg)
      }
    });
  });
};

function login(data) {
  return request('api/login', 'post', data)
}

function categoryList(data) {
  return request('api/category/list', 'get', data)
}

function cardList(data) {
  return request('api/card/list', 'get', data)
}

function cardDetail(data) {
  return request('api/card/detail', 'get', data)
}

function cardLike(data) {
  return request('api/card/like', 'post', data)
}

function cardDisLike(data) {
  return request('api/card/disLike', 'post', data)
}

function cardStar(data) {
  return request('api/card/star', 'post', data)
}

function cardDisStar(data) {
  return request('api/card/disStar', 'post', data)
}

module.exports = {
  login,
  categoryList,
  cardList,
  cardDetail,
  cardLike,
  cardDisLike,
  cardStar,
  cardDisStar
}