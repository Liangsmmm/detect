import { $wuxCountDown } from '../../../style/components/wux'

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '15735105222',
    password: '',
    token: '',
    passShow: false,
  },

  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  goRegister: function () {
    wx.navigateTo({
      url: '../register/index',
    })
  },

  vcode() {
    if (this.c2 && this.c2.interval) return !1;
    var that = this;
    this.c2 = new $wuxCountDown({
      date: +(new Date) + 30 * 1000,
      onEnd() {

        this.setData({
          c2: '短信获取',
        });

      },
      render(date) {
        const sec = this.leadingZeros(date.sec, 2) + ' 秒 '
        date.sec !== 0 && this.setData({
          c2: sec,
        })
      },
    }),
      wx.request({
        url: 'https://wx.rainswork.club/sendsms/',
        method: 'POST',
        data: {
          mobile: that.data.mobile,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var ret = res.data;
          console.log(res.data);
          if (ret.code == 0) {
            console.log("post for token 成功");
          }
        }
      });
  },
  formSubmit: function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail)
    let username = e.detail.value.username;
    let password = e.detail.value.password;
    let token = e.detail.value.token;
      if (that.data.passShow &&(username=='' || password =='')){
        wx.showToast({
          title: '登录信息不能为空！',
          icon: 'none',
          duration: 1618,
          mask: true,
        })
        return;
      
      } else if (!that.data.passShow && (username == '' || token == '') ){
        wx.showToast({
          title: '登录信息不能为空！',
          icon: 'none',
          duration: 1618,
          mask: true,
        })
        return;  
    }else {
      if (that.data.passShow) {
        that.setData({
          mobile: e.detail.value.mobile,
          password: e.detail.value.password
        })
      }
      else if (!that.data.passShow) {
        that.setData({
          mobile: e.detail.value.mobile,
          token: e.detail.value.token
        })
      }
      this.loginClick();
    }
  },
  passLogin: function (options) {
    var show = !this.data.passShow;
    this.setData({
      passShow: show
    })
  },

  loginClick: function () {
    var that = this;
    wx.request({
      url: 'https://wx.rainswork.club/login/',
      method: 'POST',
      data: {
        mobile: that.data.mobile,
        token: that.data.token,
        captcha: that.data.captcha,
        password: that.data.password,
        passShow: that.data.passShow
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.code == 0) {
          app.globalData.account_tel = that.data.mobile;
          wx.setStorageSync('account_tel', that.data.mobile);
          wx.redirectTo({
            url: '../center/index'
          })
        }else if (res.data.code == 1) {
          wx.showToast({
            title: '账号或密码错误！',
            icon: 'none',
            duration: 1618,
            mask: true,
          })
        } else if (res.data.code == 2) {
          wx.showToast({
            title: '账号或口令错误！',
            icon: 'none',
            duration: 1618,
            mask: true,
          })
        }else if (res.data.code == 3) {
          wx.showToast({
            title: '用户不存在！',
            icon: 'none',
            duration: 1618,
            mask: true,
          })
        }
      },
      fail: function(error){
        wx.showToast({
          title: '网络出错，登录失败！',
          icon: 'none',
          duration: 1618,
          mask: true,
        })
      }
    })
  }
})