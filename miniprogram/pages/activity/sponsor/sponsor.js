var app=getApp()
var fdate = new Date()
const date = new Date()
const days = []
const hours = []
const minutes = []
for (let i = 20; i <= 29; i++) {
  days.push(i)
}
for (let i = 0; i <= 23; i++) {
  hours.push(i)
}

for (let i = 0; i <= 59; i++) {
  minutes.push(i)
}
Page({
  data: {
    date: new Date(),
    days: days,
    aday: 2,
    day: 2,
    hours: hours,
    ahour: 2,
    hour: 2,
    minutes: minutes,
    aminute: 2,
    minute: 2,
    hiddenmodalput:true
  },
  choose(){
    this.setData({
      hiddenmodalput: false
    })
  },
  bindChange: function (e) {
    const val = e.detail.value

    fdate.setDate(this.data.days[val[0]])
    fdate.setHours(this.data.hours[val[1]])
    fdate.setMinutes(this.data.minutes[val[2]])
  },
  confirm() {
    var aday= fdate.getDate()
    var aminute= fdate.getHours()
    var ahour= fdate.getMinutes()
    this.setData({
      date:fdate,
      day: aday,
      minute: ahour,
      hour: aminute,
      hiddenmodalput: true
    })
  },
  cancel() {
    this.setData({
      hiddenmodalput: true
    })
  },
  formSubmit: function (e) {

    {
      if(!app.globalData.logged){
        wx.showToast({
          icon:'none',
          title: '请先登录',
        })
      }
      else{
      const db = wx.cloud.database()
      db.collection('activity').add({
        data: {
          time: this.data.date,
          position: e.detail.value.input2,
          description: e.detail.value.textarea,
          name:app.globalData.name
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
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    }
    }
  },
  formReset: function () {
    console.log('form发生了reset事件')
  }
})