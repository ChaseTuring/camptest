const db = wx.cloud.database()
var app=getApp()
Page({

  data: {
    hiddenmodalput: true,
    time:"",
    position:"",
    description:"",
    identity:"participate",
    name: "",
    qqnum:"",
    total:2,
    cur:0,
    batchTimes:0,
    hid:true
  },
  onLoad:function(){
    this.onTap()
  },
  onTap() {
    const MAX_LIMIT = 20
    var that=this;
    db.collection('meet_up').where({
      identity: "sponsor"
    }).count({
      success: function (res) {
        that.setData({
          total:res.total,
          hid:false
        })
      }
    })
    db.collection('meet_up').where({
      identity:"sponsor"
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
    if(this.data.cur>1){
      this.setData({
        cur: this.data.cur-1
      })
      if(this.data.cur>1){
        db.collection("meet_up").where({
          identity: "sponsor"
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
      else{
        db.collection('meet_up').where({
          identity: "sponsor"
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
    else{
      wx.showToast({
        icon:'none',
        title: '已经是第一页',
      })
    }
  },
  down(){
    if (this.data.cur < this.data.batchTimes) {
      this.setData({
        cur: this.data.cur + 1
      })
      db.collection("meet_up").where({
        identity: "sponsor"
      }).skip((this.data.cur-1) * 20).limit(20).get({
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
        icon:'none',
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
      identity: "sponsor"
    }).count({
      success: function (res) {
        that.setData({
          total: res.total
        })
      }
    })
    db.collection('meet_up').where({
      identity: "sponsor"
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
  onJoi: function (e) {

    {
      var that=this;
      const db = wx.cloud.database()
      db.collection('meet_up').where({
        time: e.detail.value.time,
        position: e.detail.value.position,
        description: e.detail.value.description,
        name:app.globalData.name
      }).count({
        success: function (res) {
          if (res.total>=1) {
            wx.showToast({
              icon: 'none',
              title: '您已报名过此约会'
            })
          } else {
            db.collection('meet_up').where({
              time: e.detail.value.time,
              position: e.detail.value.position,
              description: e.detail.value.description,
            }).count({
              success: function (res) {
                const cur = res.total
                if (cur >= e.detail.value.number) {
                  wx.showToast({
                    icon: 'none',
                    title: '人数已满'
                  })
                } else {
                  that.setData({
                    time: e.detail.value.time,
                    position: e.detail.value.position,
                    description: e.detail.value.description,
                    hiddenmodalput: false,
                  })
                }
              }
            })
          }
        }
      })
      
    }
  },
  iqqNum: function (e) {
    this.setData({
      qqnum: e.detail.value
    })
  },
  cancelM: function (e) {
    this.setData({
      hiddenmodalput: true,
    })
  },

  confirmM: function (e) {
    {
    this.setData({
      name:app.globalData.name,
      qqnum: this.data.qqnum,
    })
    var that=this;
    const db = wx.cloud.database()
    db.collection('meet_up').add({
      data:{
        time:that.data.time,
        position: that.data.position,
        description: that.data.description,
        identity:"participate",
        name: that.data.name,
        qqnum:that.data.qqnum
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })
        wx.showToast({
          title: '新增记录成功',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
    this.setData({
      hiddenmodalput: true,
    })
  }
  }
})
