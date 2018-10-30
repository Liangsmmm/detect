// pages/......../create.js


import util from '../../../../utils/util'

var app = getApp()

Page({
  data: {

    id: '',
    warnTypes: ["有人未戴安全帽", "有人吸烟", "安检人员未到岗", "非作业人员入场", "坑道边有人", "吊件下方有人", "自定义"],
    warnIndex: 0,
    warnContent: '',
    sendTime: '',
    sendPerson: '',
    isDefine: false,
    hasSolve: 0,

  },


  onLoad: function(options) {
    let date = util.formatTime(new Date(), true)
    console.log(date)

    if (date.constructor === Date) {
      date = util.formatTime(date, true)
    }
    this.setData({
      id: date,
      sendTime: date,
      sendPerson: app.globalData.account_tel
    })

  },


  onShareAppMessage: function(options) {
  },
  
  bindWarnTypeChange: function(e) {
    this.setData({
      warnIndex: e.detail.value
    })

    console.log(this.data.warnTypes[this.data.warnIndex])
    if (this.data.warnTypes[this.data.warnIndex] == "自定义") {
      this.setData({
        isDefine: true
      })
    } else {
      this.setData({
        isDefine: false
      })
    }
  },

  defineWarnContent: function(e) {
    this.setData({
      warnContent: e.detail.value
    });
  },

  handleCancelTap(e) {
    wx.navigateBack()
  },

 
  SaveInfoClick(e) {
    var that = this;
    if (that.data.warnTypes[that.data.warnIndex]=='自定义'&&!that.data.warnContent){
      wx.showToast({
        title: '请输入自定义违规警告信息！',
        icon:'none'
      })
      return;
    }   
    wx.request({
      url: 'https://wx.rainswork.club/warn/savewarn/',
      method: 'POST',
      data: {
        warnContent: that.data.warnContent,
        warnType: that.data.warnTypes[that.data.warnIndex],
        sendTime: that.data.sendTime,
        sendPerson: that.data.sendPerson,
        hasSolve: that.data.hasSolve
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '保存成功'
          })
        } else if (res.data.code == 1) {
          wx.showToast({
            title: '添加违规警告前需要先登录！',
            icon: 'none'

          })
        }

      },
      fail: function(error) {
        wx.showToast({
          title: '网络出错，保存失败！',
          icon: 'none',
          duration: 1618,
          mask: true,
        })
      }
    })


    wx.navigateBack({
      url: '../index/index',
    })

  },


})