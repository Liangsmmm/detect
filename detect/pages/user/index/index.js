
const app = getApp()

Page({
  data: {
    hasUserInfo: false,
    aboutDot: true,
    feedBackDot: true,

  },

  listOnClick: function(e) {
    var toUrl = e.currentTarget.dataset.redirect;
    wx.navigateTo({
      url: toUrl
    })
  },

  onShow: function() {

    var THIS = this;
    wx.getStorage({
      key: 'aboutDot',
      success: function(res) {
        THIS.setData({
          aboutDot: wx.getStorageSync('aboutDot')
        })
      },
    })
    wx.getStorage({
      key: 'feedBackDot',
      success: function(res) {
        THIS.setData({
          feedBackDot: wx.getStorageSync('feedBackDot')
        })
      },
    })
  },
  onLoad: function() {},
})