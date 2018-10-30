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
    distance: -1,
    showModal: false,
    disable: false,


  },
  /**
   * 弹窗
   */
  showMyDialog: function () {
    this.setData({
      showModal: true
    })
  },

  /**
   * 隐藏模态对话框
   */
  hideMyDialog: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    wx.showToast({
      title: '请重新进入，完成人脸签到!',
      duration: 2500,
      icon: 'none'
    });
    setTimeout(function () {
      wx.switchTab({
        url: '../index/index',
      })
    }, 2000);

  },
  getAuthorize: function (e) {
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
  onLoad: function (e) {
    // 未上传头像或者未登录
    if (app.globalData.account_avatar == '' || !wx.getStorageSync('account_tel')) {
      wx.showModal({
        title: '提示',
        content: '签到需更新头像，现在要更新么？',
        success: function (res) {
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
  takePhoto: function () {

    // 未通过检查，出现model
    if (!wx.getStorageSync('authAll')) {
      this.showMyDialog();
      return;
    }

    if (this.data.hasTakePhoto == false) {

      var that = this;
      this.getPosition();

      this.ctx.takePhoto({
        quality: 'high',
        success: (res) => {

          console.log('res:', res)

          that.setData({
            src: res.tempImagePath,
            disable: true
          })
          console.log('path:' + res.tempImagePath)
          wx.uploadFile({
            url: 'https://wx.rainswork.club/headupload/', //仅为示例，非真实的接口地址
            filePath: res.tempImagePath,
            name: 'imagefile',
            formData: {
              'account_tel': app.globalData.account_tel,
              'mode': 'face'
            },
            success: function () {
              console.log('upload image success')
              wx.request({
                url: 'https://wx.rainswork.club/facecompare/', //仅为示例，并非真实的接口地址
                method: 'POST',
                data: {
                  account_tel: app.globalData.account_tel,
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                success: function (res) {
                  var ret = res.data;
                  console.log(ret);
                  if (ret.code == 0) {
                    console.log('detect pass');
                    // 1、判断距离
                    if (that.data.distance >= 0) {
                      // 2、判断人脸
                      if (ret['similarity'] > 70) {
                        wx.showModal({
                          title: '打卡成功',
                          content: '恭喜解锁新姿势ヾ(◍°∇°◍)ﾉﾞ',
                          success: function (res) {
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
                        console.log('similarity is lower than 70')
                        wx.showToast({
                          title: '签到失败，换个姿势！',
                          icon: 'none',
                          duration: 2500
                        })
                      }

                    } else {
                      wx.showToast({
                        title: '签到失败，距离太远！',
                        icon: 'none',
                        duration: 2500
                      });
                    }
                    console.log('upload_success,人脸识别结果：' + ret.similarity)
                  } else if (ret.code == 1) {
                    wx.showToast({
                      title: '人脸检测失败！',
                      icon: 'none',
                      duration: 2500
                    });
                  }

                },
                fail: function () {
                  wx.showToast({
                    title: '服务器错误，请稍后重试！',
                    icon: 'none',
                    duration: 2500
                  })
                }
              });




              // var ret = JSON.parse(res.data);
              // console.log(ret)
              // if (ret.code == 0) {
              //   // 1、判断距离
              //   if (that.data.distance >= 0) {
              //     // 2、判断人脸
              //     if (ret['similarity'] > 70) {
              //       wx.showModal({
              //         title: '打卡成功',
              //         content: '恭喜解锁新姿势ヾ(◍°∇°◍)ﾉﾞ',
              //         success: function (res) {
              //           if (res.confirm) {
              //             wx.switchTab({
              //               url: '../index/index',
              //             })
              //           }
              //         }
              //       });
              //     } else {
              //       wx.showToast({
              //         title: '签到失败，换个姿势！',
              //         icon: 'none',
              //         duration: 2500
              //       })
              //     }

              //   } else {
              //     wx.showToast({
              //       title: '签到失败，距离太远！',
              //       icon: 'none',
              //       duration: 2500
              //     });
              //   }
              //   console.log('upload_success,人脸识别结果：' + ret.similarity)
              // } 
              // else {
              //   console.log('upload_fail')
              //   wx.showToast({
              //     title: '签到失败,重新尝试！',
              //     icon: 'none',
              //     duration: 2500
              //   });
              // }
            },
            fail: function () {
              console.log('upload image fail')
              wx.showToast({
                title: '服务器错误，请稍后再试3！',
                icon: 'none',
                duration: 2500
              })
            },
            complete: function () {
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
    // this.uploadphoto();
  },

  takePhotoError(e) {
    console.log(e.detail)
    wx.showModal({
      title: '提示',
      content: '相机启动失败！',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },


  getPosition: function () {
    var that = this;
    // console.log('---getPosition---')
    // 获取当前位置经纬度
    wx.getLocation({
      type: 'gcj02',
      // type: 'wgs84',
      success: function (res) {
        // console.log('---1---')
        var here_latitude = res.latitude;
        var here_longitude = res.longitude

        // pos==>str ,设置地理位置
        demo.reverseGeocoder({
          location: {
            latitude: here_latitude,
            longitude: here_longitude,
            coord_type: 5
          },
          success: function (res) {
            // console.log('-----2-----')
            if (res.status == 0) {
              that.setData({
                currentPos: res.result.address,
              });
            } else {
              wx.showToast({
                title: '服务器错误1，转换经纬坐标至位置失败！',
                icon: 'none',
                duration: 2500
              });
            }
          },
          fail: function (res) {
            //  demo.reverseGeocoder
            wx.showToast({
              title: '服务器错误2，转换经纬坐标至位置失败！',
              icon: 'none',
              duration: 2500
            });
          },
        });

        // str==>pos, get distance
        demo.geocoder({
          address: that.data.destination,
          success: function (res) {
            var there_longitude = res.result.location.lng;
            var there_latitude = res.result.location.lat;

            demo.calculateDistance({
              'from': {
                latitude: here_latitude,
                longitude: here_longitude
              },
              'to': [{
                latitude: there_latitude,
                longitude: there_longitude
              }],
              success: function (res) {
                if (res.status == 0) {
                  let tmp_distance = res.result.elements[0].distance;
                  if (tmp_distance >= 0 && tmp_distance < that.data.targetDistance) {
                    that.setData({
                      distance: tmp_distance
                    })
                  } else {
                    that.setData({
                      distance: tmp_distance + '米,' + '超出签到范围'
                    })
                  }
                } else {

                  that.setData({
                    distance: res.message
                  })
                }
              },
              fail: function (res) {
                console.log('服务器错误3:' + res)
                // wx.showToast({
                //   title: '服务器错误3，计算两者距离出错！',
                //   icon: 'none',
                //   duration: 2500
                // });
                that.setData({
                  distance: res.message
                });
              }
            });
          },
          fail: function () {
            //demo.geocoder
            //获取目标位置经纬度 str->pos
            console.log('获取目标位置经纬度失败')
          }
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '服务器错误4，获取当前位置经纬度失败！',
          icon: 'none',
          duration: 2500
        })
      }
    });
  },

})