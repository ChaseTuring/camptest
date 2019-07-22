var app = getApp()
Page({
  formSubmit: function (e) {

    {
      if (!app.globalData.logged) {
        wx.showToast({
          icon: 'none',
          title: '请先登录',
        })
      }
      else {
      const db = wx.cloud.database()
      db.collection('flag').add({
        data: {
          time: e.detail.value.input1,
          description: e.detail.value.textarea,
          kind:"others",
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
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id),

            console.log(e.input)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    }
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    }
  },
  formReset: function () {
    console.log('form发生了reset事件')
  }
})