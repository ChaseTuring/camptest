var app=getApp()
const db = wx.cloud.database()
Page({
  data: {
    total: 2,
    cur: 0,
    batchTimes: 0,
    hid: true,
    _openid: ""
  },
  onLoad:function(){
    this.onTap()
  },
  onTap() {
    const MAX_LIMIT = 20
    var that = this;
    db.collection('flag').where({
      kind: "others"
    }).count({
      success: function (res) {
        that.setData({
          total: res.total,
          hid: false
        })
      }
    })
    console.log(app.globalData.openid)
    db.collection('flag').where({
      kind: "others"
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
        db.collection("flag").where({
          kind: "others"
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
        db.collection('flag').where({
          kind: "others"
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
      db.collection("flag").where({
        kind: "others"
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
    db.collection('flag').where({
      kind: "others"
    }).count({
      success: function (res) {
        that.setData({
          total: res.total
        })
      }
    })
    db.collection('flag').where({
      kind:"others"
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

  }

})