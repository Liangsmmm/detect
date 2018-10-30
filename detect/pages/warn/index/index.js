Page({


  data: {
    
  },

  
  onLoad: function (options) {
    
  },

  recvAbsenceInfo: function () {
    wx.navigateTo({
      url: '../absence/index'
    })
  },

  sendWarnInfo:function(){
    wx.navigateTo({
      url: '../send/index/index'
    })
  },

  recvWarnInfo:function(){

  },
 
})