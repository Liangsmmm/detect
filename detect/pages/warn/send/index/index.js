import util from '../../../../utils/util'
var app = getApp()
var sliderWidth = 96;

Page({
  data: {
    warnInfos: [],
    tabs: ["未处理", "已处理"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    prePage: 0,
    hasAddPower: 0
  },

  onShow: function() {

    this.setData({
      prePage: 0,
      warnInfos: [],
    });

    this.getWarnList();
  },
  onLoad: function() {

    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.getUserAddPower();
  },



 
  handleAddNote() {
    wx.navigateTo({
      url: '../create/index'
    })
  },

  scrollToLower: function(e) {
    var nextPage = parseInt(this.data.warnInfos.length / 7) + 1;
    if (this.data.prePage != nextPage) {
      this.getWarnList(nextPage);
      this.setData({
        prePage: nextPage
      });
    }

  },

  navBarClick: function(e) {
    this.setData({
      activeIndex: e.currentTarget.id,
    });
  },

  getWarnList: function(whichPage = 1) {
    var that = this;
    wx.request({
      url: 'https://wx.rainswork.club/warn/getwarninfo/',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        whichPage: whichPage
      },
      success: function(res) {
        var ret = res.data
        if (res.data.code == 0) {
          var ret_warns = util.logsFormat(that.data.warnInfos.concat(ret.data.warns), 'sendTime');
          that.setData({
            warnInfos: ret_warns
          })

        } else if (res.data.code == 1) {
        
          wx.showToast({
            title: '失败',
            icon: 'none'

          })
        }

      },
      fail: function(error) {
        wx.showToast({
          title: '网络出错，获取违规警告列表失败！',
          icon: 'none',
          duration: 1618,
          mask: true,
        })
      }
    })
  },

  getUserAddPower:function(){
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
          console.log("没有权限")
        }

      },
      fail: function (error) {
       
      }
    })
  }
})