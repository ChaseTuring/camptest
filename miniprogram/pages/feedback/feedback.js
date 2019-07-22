
const db = wx.cloud.database()
const app = getApp()
Page({
  onSub:function(e){
    const db=wx.cloud.database()
    db.collection('feedback').add({
      data: {
        description:e.detail.value.textarea
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功: ', res)
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
})