const db = wx.cloud.database()
var app = getApp()
Page({

  data: {
    time: "",
    position: "",
    description: "",
    identity: "participate",
    name: "",
    qqnum: "",
    total: 2,
    cur: 0,
    batchTimes: 0,
    hid: true
  },
  onLoad: function () {
    this.onTap()
  },
  onTap() {
    const MAX_LIMIT = 20
    var that = this;
    db.collection('meet_up').where({
      _openid: app.globalData.openid
    }).count({
      success: function (res) {
        that.setData({
          total: res.total,
          hid: false
        })
      }
    })
    db.collection('meet_up').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2),
          list: res.data,
          batchTimes: Math.ceil(this.data.total / 20),
          cur: 1
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

  },
  up() {
    if (this.data.cur > 1) {
      this.setData({
        cur: this.data.cur - 1
      })
      if (this.data.cur > 1) {
        db.collection("meet_up").where({
          _openid: app.globalData.openid
        }).skip((this.data.cur - 1) * 20).limit(20).get({
          success: res => {
            this.setData({
              queryResult: JSON.stringify(res.data, null, 2),
              list: res.data
            })
            console.log('[数据库] [查询记录] 成功: ', res)
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '查询记录失败'
            })
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })
      }
      else {
        db.collection('meet_up').where({
          _openid: app.globalData.openid
        }).get({
          success: res => {
            this.setData({
              queryResult: JSON.stringify(res.data, null, 2),
              list: res.data
            })
            console.log('[数据库] [查询记录] 成功: ', res)
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '查询记录失败'
            })
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })
      }
    }
    else {
      wx.showToast({
        icon: 'none',
        title: '已经是第一页',
      })
    }
  },
  down() {
    if (this.data.cur < this.data.batchTimes) {
      this.setData({
        cur: this.data.cur + 1
      })
      db.collection("meet_up").where({
        _openid: app.globalData.openid
      }).skip((this.data.cur - 1) * 20).limit(20).get({
        success: res => {
          this.setData({
            queryResult: JSON.stringify(res.data, null, 2),
            list: res.data
          })
          console.log('[数据库] [查询记录] 成功: ', res)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    }
    else {
      wx.showToast({
        icon: 'none',
        title: '已经是最后一页',
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const MAX_LIMIT = 20
    var that = this;
    db.collection('meet_up').where({
      _openid: app.globalData.openid
    }).count({
      success: function (res) {
        that.setData({
          total: res.total
        })
      }
    })
    db.collection('meet_up').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2),
          list: res.data,
          batchTimes: Math.ceil(this.data.total / 20),
          cur: 1
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

  },
  oncheck: function (e) {
    {
      app.data.time= e.detail.value.time,
      app.data.position=e.detail.value.position,
      app.data.description=e.detail.value.description,
      wx.navigateTo({
        url: '/pages/detail/detail',
      })
    }
  }
})
