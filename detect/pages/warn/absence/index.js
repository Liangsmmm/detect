import util from '../../../utils/util'
var app = getApp()
var sliderWidth = 96; 

Page({

  data: {
   
    absenceInfos: [],
  
    tabs: ["未处理", "已处理"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    prePage: 0,
  

  },

  onShow: function () {

    this.setData({
      prePage: 0,
      absenceInfos: [],
    });

    this.getAbsenceList();
  },
  onLoad: function () {
   
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    
  },

  scrollToLower: function (e) {
    var nextPage = parseInt(this.data.absenceInfos.length / 7) + 1;
    if (this.data.prePage != nextPage) {
      this.getAbsenceList(nextPage);
      this.setData({
        prePage: nextPage
      });
    }

  },
 
  
  navBarClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id,
    });
  },

  getAbsenceList: function (whichPage = 1) {
    var that = this;
    wx.request({
      url: 'https://wx.rainswork.club/user/gettempabsence/',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        whichPage: whichPage
      },
      success: function (res) {
        var ret = res.data
        if (res.data.code == 0) {
          var ret_absences = util.logsFormat(that.data.absenceInfos.concat(ret.data.temp_absent_employees), 'sendTime');
          that.setData({
            absenceInfos: ret_absences
          })

        } else if (res.data.code == 1) {
         
          wx.showToast({
            title: '失败',
            icon: 'none'

          })
        }

      },
      fail: function (error) {
        wx.showToast({
          title: '网络出错，获取未签到人员列表失败！',
          icon: 'none',
          duration: 1618,
          mask: true,
        })
      }
    })
  },

  getUserAddPower: function () {
    var that = this;
    wx.request({
      url: 'https://wx.rainswork.club/getUserAddPower/',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        account_tel: app.globalData.account_tel
      },
      success: function (res) {
        var ret = res.data
        if (res.data.code == 0) {

          that.setData({
            hasAddPower: res.data.hasAddPower
          })


        } else if (res.data.code == 1) {
         
        }

      },
      fail: function (error) {
       
      }
    })
  }
})