var app=getApp()
Page({
  formSubmit:function(e){
    const db = wx.cloud.database()
    db.collection('info').where({
      account:e.detail.value.input1,
      password:e.detail.value.input2
    }).count({
      success: function (res) {
        console.log(res.total)
        if(res.total==1){
          db.collection('info').where({
            account: e.detail.value.input1,
            password: e.detail.value.input2
          }).get({
            success: res =>{
              app.globalData.name=res.data[0].name
              app.globalData.logged = true
              db.collection('info').add({
                data: {
                  account: e.detail.value.input1,
                  password: e.detail.value.input2,
                  name: app.globalData.name
                },
                success: res => {
                  // 在返回结果中会包含新创建的记录的 _id
                  wx.switchTab({
                    url: '/pages/about/about'
                  })
                  wx.showToast({
                    title: '登录成功',
                  })
                  console.log('[数据库] [新增记录] 成功: ', res)
                },
                fail: err => {
                  wx.showToast({
                    icon: 'none',
                    title: '登录失败'
                  })
                  console.error('[数据库] [新增记录] 失败：', err)
                }
              })
            }
          })
          
        }
        else if(res.total>1){
          wx.switchTab({
            url: '/pages/about/about'
          })
          wx.showToast({
            title: '登录成功',
          })
        }
        else{
          wx.showToast({
            icon:"none",
            title: '账号或密码错误',
          })
        }
      }
    })
  }
})