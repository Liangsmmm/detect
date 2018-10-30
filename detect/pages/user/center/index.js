var app = getApp()
var base64 = require("../../../images/icon.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    account_avatar: base64.userhead128,
    disable: false,
    account_site: '无',
    account_tel: '',
    array: [''],
    index: 0
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      account_site: this.data.array[e.detail.value]
    })
    // app.globalData.account_site = this.data.array[e.detail.value];
    wx.setStorageSync('selectLocation', this.data.array[e.detail.value])

  },
  quitBtnClick: function() {
    try {
      app.globalData.account_tel && (app.globalData.account_tel = null);
      wx.getStorageSync('account_tel') && wx.setStorageSync('account_tel', '');
      wx.switchTab({
        url: '../index/index',
      });
    } catch (e) {
      console.log(e);
    }
  },
  onLoad: function(options) {
    if (app.globalData.account_tel == null) {
      wx.redirectTo({
        url: '../login/index'
      })
    } else {
      this.getUserInfo();
    }
  },

  getUserInfo: function() {
    var that = this;
    wx.request({
      url: 'https://wx.rainswork.club/getuserinfo/',
      data: {
        account_tel: app.globalData.account_tel,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var ret = res.data;
        that.setData({
          account_tel: app.globalData.account_tel,
          array: ret.positions,
        });
        if (ret.code == 0) {
          var avatarUrl = ret.avatarUrl;
          if (avatarUrl != '') {
            that.setData({
              account_avatar: ret.avatarUrl
            });
          }
          app.globalData.account_avatar = ret.avatarUrl;
          var loc = that.data.array;
          var locateIndex = loc.findIndex(x => {
            return x == wx.getStorageSync('selectLocation')[0]
          })
          console.log('locateIndex:' + locateIndex + ':' + wx.getStorageSync('selectLocation')[0])
          if (locateIndex >= 0) {
            let temp;
            temp = loc[0];
            loc[0] = loc[locateIndex];
            loc[locateIndex] = temp;
            that.setData({
              array: loc
            });
          } else {
            wx.setStorageSync('selectLocation', that.data.array[0]);
          }
        }

      }
    });
  },


  openActionSheet: function() {
    var item = this.data.account_avatar && '修改头像(请联系管理)' || '上传头像(前置相机自拍)';
    var itemList = [item, '查看照片'];
    var that = this;
    wx.showActionSheet({
      itemList: itemList,
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseHead();
          } else if (res.tapIndex == 1) {
            wx.previewImage({
              urls: [that.data.account_avatar],
            })
          }
        }
      }
    });
  },


  chooseHead: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: function(res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths[0]
        that.setData({
          account_avatar: tempFilePaths
        })
        wx.uploadFile({
          url: 'https://wx.rainswork.club/headupload/',
          filePath: tempFilePaths,
          name: 'imagefile',
          formData: {
            'account_tel': that.data.account_tel,
            'mode': 'center',
          },
          success: function(res) {
            console.log('upoad-res.data:' + res.data)
            var ret = JSON.parse(res.data);
            console.log(ret)
            if (ret.code == 0) {
              console.log('upload_success')
            } else if (ret.code == 1) {
              console.log('upload_fail')
            }

          },
          fail: function(error) {
            console.log('error.data:' + error.data)
          }
        })
      }
    })
  }
})