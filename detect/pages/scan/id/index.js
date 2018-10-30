var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var demo = null;
var app = getApp();

Page({

  data: {
    src: null,
    targetDistance: 2500, //控制打卡距离
    currentPos: '',
    hasTakePhoto: false,
    uploadFile: [],
    here_longitude: '',
    here_latitude: '',
    there_longitude: '',
    there_latitude: '',
    destination: '',
    distance: -1,
    showModal: false,
    disable: false,
    user_name:'',
    user_id:'',
    user_address:'',
    user_sex:'',
    user_nation:''


  },
 
  showMyDialog: function() {
    this.setData({
      showModal: true
    })
  },


  hideMyDialog: function() {
    this.setData({
      showModal: false
    });
  },

  onCancel: function() {
    wx.showToast({
      title: '请重新进入，完成人脸签到!',
      duration: 2500,
      icon: 'none'
    });
    setTimeout(function() {
      wx.switchTab({
        url: '../index/index',
      })
    }, 2000);

  },
  getAuthorize: function(e) {
    var auth = e.detail;
    console.log(auth.authSetting['scope.camera'])
    if (!auth.authSetting['scope.camera'] ) {
      return;
    } else {
      wx.setStorageSync('authAll', '1')
      this.hideMyDialog();
      this.onCancel();
    }
  },
  onLoad: function(e) {
    wx.authorize({
      scope: 'scope.userLocation',
    })
    this.ctx = wx.createCameraContext();
   

  },
  takePhoto: function() {
    if (!wx.getStorageSync('authAll')) {
      this.showMyDialog();
      return;
    }

    if (this.data.hasTakePhoto == false) {

      var that = this;
      this.ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          console.log('res:',res)
          that.setData({
            src: res.tempImagePath,
            disable: true
          })
          console.log('path:'+res.tempImagePath)
          wx.uploadFile({
            url: 'https://wx.rainswork.club/user/idpicverify/', //仅为示例，非真实的接口地址
            filePath: res.tempImagePath,
            name: 'imagefile',
            formData: {
            },
            success: function(res) {
          
              var ret = JSON.parse(res.data);
              if (ret.code == 0) {
                that.setData({
                  user_name: ret.data.name,
                  user_id: ret.data.id,
                  user_address:ret.data.address,
                  user_sex:ret.data.sex,
                  user_nation:ret.data.nation
                })

                wx.showModal({
                  title: '提示',
                  content: '身份证信息已录入！',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    }
                  }
                })
              }
              else if (ret.code == 1){
                that.setData({
                  user_name: ret.data.name,
                  user_id: ret.data.id,
                  user_address: ret.data.address,
                  user_sex: ret.data.sex,
                  user_nation: ret.data.nation
                })
                wx.showModal({
                  title: '提示',
                  content: '身份证信息已存在！',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    }
                  }
                })
              }
              else{
                wx.showModal({
                  title: '提示',
                  content: '身份证信息录入失败！',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    }
                  }
                })
              }
         
            },
            fail: function() {
              console.log('upload image fail')
              wx.showToast({
                title: '服务器错误，请稍后再试！',
                icon: 'none',
                duration: 2500
              })
            },
            complete: function() {
              that.setData({
                disable: false
              })
            }
          });


        }
      });
    }

    var hasTakePhoto = this.data.hasTakePhoto;
    this.setData({
      hasTakePhoto: !hasTakePhoto,
    });

  },

  takePhotoError(e) {
    console.log(e.detail)
    wx.showModal({
      title: '提示',
      content: '相机启动失败！',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },




})