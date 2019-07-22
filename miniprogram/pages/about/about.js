var app=getApp()
Page({
  data: {
    hide: true
  },
  onShow() {
    if (app.globalData.logged) {
      this.setData({
        hide: false
      })
    }
  },
  onLoad() {
    if (app.globalData.logged) {
      this.setData({
        hide: false
      })
    }
  },
  Onac() {
    wx.navigateTo({
      url: '/pages/about/my_activity/my_activity',
    })
  },
  Onflag(){
    wx.navigateTo({
      url: "/pages/about/my_flag/my_flag",
    })
  },
  Onmeet() {
    wx.navigateTo({
      url: "/pages/about/my_meet_up/my_meet_up",
    })
  },
  Onload() {
    wx.navigateTo({
      url: "/pages/load/load",
    })
  },
  Onfed(){
    wx.navigateTo({
      url: "/pages/feedback/feedback",
    })
  }
})