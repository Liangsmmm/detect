//app.js
App({
  onLaunch: function () {
    this.globalData.account_tel = wx.getStorageSync('account_tel') || null;
    wx.getStorageSync('authAll') || wx.setStorageSync('authAll', '')
    wx.getStorageSync('selectLocation') || wx.setStorageSync('selectLocation', '')
  },
  globalData: {
    jingdu:'',
    weidu:'',
    account_tel: null,
    address:'',
    account_avatar:'',
    warns:[]
  }
})