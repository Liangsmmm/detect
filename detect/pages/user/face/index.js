// 引入SDK核心类
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
    distance: 0,
    showModal: false,
    disable: false,


  },
  /**
   * 弹窗
   */
  showMyDialog: function() {
    this.setData({
      showModal: true
    })
  },

  /**
   * 隐藏模态对话框
   */
  hideMyDialog: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
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
    // console.log(e)
    var auth = e.detail;
    // 1、索要2个授权
    console.log(auth.authSetting['scope.camera'])
    console.log(auth.authSetting['scope.userLocation'])
    if (!auth.authSetting['scope.camera'] || !auth.authSetting['scope.userLocation']) {
      return;
    } else {
      wx.setStorageSync('authAll', '1')
      this.hideMyDialog();
      this.onCancel();
    }
  },
  onLoad: function(e) {
    // 未上传头像或者未登录
    if (app.globalData.account_avatar == '' || !wx.getStorageSync('account_tel')) {
      wx.showModal({
        title: '提示',
        content: '签到需更新头像，现在要更新么？',
        success: function(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../center/index',
            });
          } else if (res.cancel) {
            wx.switchTab({
              url: '../index/index',
            })
          }
        }
      })


      return;
    }


    wx.authorize({
      scope: 'scope.userLocation',
    })

    this.setData({
      destination: wx.getStorageSync('selectLocation')
    })
    console.log('destination:' + this.data.destination)

    this.ctx = wx.createCameraContext();
    // 实例化API核心类
    demo = new QQMapWX({
      key: 'PLGBZ-HSQEF-PRPJB-NUUJY-E4FZO-A2BWF' // 必填
    });

  },
  takePhoto: function() {
    if (!wx.getStorageSync('authAll')) {
      this.showMyDialog();
      return;
    }

    if (this.data.hasTakePhoto == false) {

      var that = this;
      // this.getPosition();

      this.ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          that.setData({
            src: res.tempImagePath,
            disable: true
          })
          wx.uploadFile({
            url: 'https://wx.rainswork.club/headupload/', //仅为示例，非真实的接口地址
            filePath: res.tempImagePath,
            name: 'imagefile',
            formData: {
              'account_tel': app.globalData.account_tel,
              'mode': 'face'
            },
            success: function() {
              wx.request({
                url: 'https://wx.rainswork.club/facecompare/', //仅为示例，并非真实的接口地址
                method: 'POST',
                data: {
                  account_tel: app.globalData.account_tel,
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                success: function(res) {
                  var ret = res.data;
                  if (ret.code == 0) {
                    if (that.data.distance >= 0) {
                      if (ret['similarity'] > 70) {
                        wx.showModal({
                          title: '打卡成功',
                          content: '恭喜解锁新姿势ヾ(◍°∇°◍)ﾉﾞ',
                          success: function(res) {
                            if (res.confirm) {
                              wx.switchTab({
                                url: '../index/index',
                              })
                            }
                          }
                        });
                        wx.request({
                          url: 'https://wx.rainswork.club/attendrecord/',
                          method: 'POST',
                          data: {
                            account_tel: app.globalData.account_tel,
                          },
                          header: {
                            'content-type': 'application/x-www-form-urlencoded'
                          },
                          success: function (res) {
                            var ret = res.data;
                            console.log(res.data);
                            if (ret.code == 0) {
                              console.log("attend record 成功");
                            } else if (ret.code == 1) {
                              console.log("attend record 失败");
                            }
                          }
                        });
                      } else {
                        wx.showToast({
                          title: '签到失败，换个姿势！',
                          icon: 'none',
                          duration: 2500
                        })
                      }

                    } else {
                      wx.showToast({
                        title: '签到失败！',
                        icon: 'none',
                        duration: 2500
                      });
                    }
                  } else if (ret.code == 1) {
                    wx.showToast({
                      title: '人脸检测失败！',
                      icon: 'none',
                      duration: 2500
                    });
                  }
                },
                fail: function() {
                  wx.showToast({
                    title: '服务器错误，请稍后重试！',
                    icon: 'none',
                    duration: 2500
                  })
                }
              });
            },
            fail: function() {
              wx.showToast({
                title: '服务器错误，请稍后再试3！',
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