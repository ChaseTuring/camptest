
var app = getApp()
Page({
  onTapSpo(){
    wx.navigateTo({
      url: "/pages/activity/sponsor/sponsor",
    })
  },
  onTapJoi(){
    wx.navigateTo({
      url: "/pages/activity/join in/join in",
    })
  },
  onLoad:function(){
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.OPENID)
        app.globalData.openid = res.result.OPENID
        const db = wx.cloud.database()
        db.collection('info').where({
          _openid: app.globalData.openid
        }).count({
          success: function (res) {
            if (res.total == 1) {
              db.collection('info').where({
                _openid: app.globalData.openid
              }).get({
                success: res => {
                  app.globalData.name = res.data[0].name
                  app.globalData.logged = true
                  wx.showToast({
                    title: '登录成功',
                  })
                }
              })
            }
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          icon:'none',
          title: '请退出重试',
        })
      }
    })
}
})