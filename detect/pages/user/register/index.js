import { $wuxCountDown } from '../../../style/components/wux'

Page({
  data: {
    mobile: '',
    token: '',
    nick_name: '',
    password1: '',
    password2: '',
    captcha: '',
    captchaCode: '',
    captchaUrl: ''

  },

  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
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
        url: 'https://wx.rainswork.club/sendsms/', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          mobile: that.data.mobile,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          var ret = res.data;
          console.log(res.data);
          if (ret.code == 0) {
            console.log("post for token 成功");
          }
          else if (ret.code == 1) {
            console.log("post for token 失败");
          }
        }
      });
  },

  goLogin: function () {
    wx.navigateBack({
      url: '../login/index',
    })
  },

  onLoad: function () {
    this.getCaptcha();
  },

  formSubmit: function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e)
    let mobile = e.detail.value.mobile;
    let token = e.detail.value.token;
    let password1 = e.detail.value.password1;
    let password2 = e.detail.value.password2;
    let captcha = e.detail.value.captcha;
    let nick_name = e.detail.value.nick_name;

    that.setData({ mobile: mobile })
    that.setData({ token: token })
    that.setData({ password1: e.detail.value.password1 })
    that.setData({ password2: e.detail.value.password2 })
    that.setData({ captcha: e.detail.value.captcha })
    that.setData({ nick_name: e.detail.value.nick_name })


    if (mobile == "" || token == "" || nick_name == '' || password1 == "" || password2 == "" || captcha == "") {
      wx.showToast({
        title: '请输入完整信息！',
        icon: 'none',
        duration: 1618,
        mask: true,
      })
      return;
    } else {
      if (this.checkPassword(password1)) {
        if (password1 != password2) {
          wx.showToast({
            title: '两次密码不一致！',
            icon: 'none',
            duration: 1618,
            mask: true,
          })
          return ;
        }
      }

      if (captcha.toUpperCase() != this.data.captchaCode) {
        wx.showToast({
          title: '验证码错误，请重新输入',
          icon: 'none',
          duration: 1618,
          mask: true,
        })
        this.getCaptcha();
        return;
      }
    }
    this.registerBtn();
  },

  checkPassword: function (password1) {
    let str = /^[0-9a-zA-z_]{6,}$/
    if (str.test(password1)) {
      return true
    } else {
      wx.showToast({
        title: '密码只可使用字母、数字、下划线，且不小于六位！',
        icon: 'none'
      })
      return false;
    }
  },

  checkMobileNum: function (mobile) {
    let str = /^1\d{10}$/
    if (str.test(mobile)) {
      return true
    } else {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
      return false;
    }
  },

  checkEmail: function (email) {
    let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (str.test(email)) {
      return true;
    } else {
      wx.showToast({
        title: '请填写正确的邮箱号',
        icon: 'none'
      })
      return false;
    }
  },

  getCaptcha: function () {
    var that = this;
    wx.request({
      url: 'https://wx.rainswork.club/captcha/',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var ret = res.data;
        if (ret.code == 0) {
          console.log(ret.data)
          that.setData({
            captchaCode: ret.data.captchaCode,
            captchaUrl: ret.data.captchaUrl,
          })
        }
      },
    });
  },


  registerBtn: function () {
    var that = this;
    wx.request({
      url: 'https://wx.rainswork.club/register/', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        mobile: that.data.mobile,
        token: that.data.token,
        captcha: that.data.captcha,
        nick_name: that.data.nick_name,
        password: that.data.password1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.navigateTo({
            url: '../login/index'
          })
        }
        else if (res.data.code == 1) {
          wx.showToast({
            title: '口令输入错误！',
            icon: 'none',
            duration: 1618,
            mask: true,
          })
        }
        else if (res.data.code == 2) {
          console.log("该账号已存在！");
          wx.showToast({
            title: '该账号已存在！',
            icon: 'none'
          })
        }
      }
    })
  },
});