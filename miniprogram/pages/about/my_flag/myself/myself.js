
const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    total: 2,
    cur: 0,
    batchTimes: 0,
    hid: true,
    _openid: ""
  },
  onLoad(){
    this.onTap()
  },
  onTap() {
    const MAX_LIMIT = 20
    var that = this;
    db.collection('flag').where({
      kind: "myself",
      _openid: app.globalData.openid
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
      kind: "myself",
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
        db.collection("flag").where({
          kind: "myself",
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
        db.collection('flag').where({
          kind: "myself",
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
      db.collection("flag").where({
        kind: "myself",
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
    db.collection('flag').where({
      kind: "myself",
      _openid: app.globalData.openid
    }).count({
      success: function (res) {
        that.setData({
          total: res.total
        })
      }
    })
    db.collection('flag').where({
      kind: "myself",
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
  ondelete: function (e) {
    {
      const db = wx.cloud.database()
      wx.showModal({
        title: '删除flag',
        content: '确定要删除该flag？',
        showCancel: true,//是否显示取消按钮
        cancelText: "否",//默认是“取消”
        cancelColor: 'skyblue',//取消文字的颜色
        confirmText: "是",//默认是“确定”
        confirmColor: 'skyblue',//确定文字的颜色
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            var that = this;
            db.collection('flag').where({
              kind: "myself",
              _openid: app.globalData.openid,
              time: e.detail.value.time,
              name:e.detail.value.name,
              description: e.detail.value.description
            }).get({
              success: res => {
                console.log(res)
                const resid = res.data[0]._id;
                db.collection('flag').doc(resid).remove({
                  success: function (res) {
                    wx.showToast({
                      title: '删除成功',
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
  }

})