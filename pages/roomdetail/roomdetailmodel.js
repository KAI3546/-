import { Base } from "../../utils/base.js";

class Roomdetail extends Base {
  constructor() {
    super()
  }
  /*
  *根据id获取房间详细信息
  */
  getroomdetail(id, callback) {
    var params = {
      url: '/Roomdetail/' + id,
      sCallback: function (res) {
        callback && callback(res);
      }
    }
    this.request(params);
  }
  /*
  *获取当前日期根据参数获取下一天的日期
  */
  GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    return m + "-" + d;
  }


  /*
  *提交订单信息到数据库
  */
  submitorder(that, callback) {
    console.log('2kkkkkl');
    var userid = wx.getStorageSync('userid');
    var params = {
      url: '/Roomorder',
      type: 'post',
      data: { roomid: that.data.id, date: that.data.datestage, stage: that.data.stage, userid: userid, price: that.data.roomdetail['0'].Rprice },
      sCallback: function (res) {
        console.log('kllllllllllllllllllllaaaaa');
        console.log(res);
        wx.setStorageSync('orderid',res);
        callback && callback(res);
      }
    }
    this.request(params);
  }



  dowxpay(that) {
    var that2 = this
    var params = {
      url: 'orderpay',
      type: 'post',
      data: { price: that.data.roomdetail['0'].Rprice, openid: wx.getStorageSync('openid'), orderid: wx.getStorageSync('orderid') },
      sCallback: function (res) {
        console.log('huangkai---');
        console.log(res);
        that2.wxpay(res, (data) => {
          that2.donepay(data, that);
        })
      }
    }
    this.request(params);

  }


  wxpay(res, callback) {
    console.log('22222222222222');
    console.log(res.timeStamp);
    wx.requestPayment({
      timeStamp: res.timeStamp,
      nonceStr: res.nonceStr,
      package: res.package,
      signType: 'MD5',
      paySign: res.paySign,
      success: function (data) {
        callback && callback(1);
      },
      fail:function(data){
        callback && callback(0);
      }
    })
  }
  donepay(data,that) {
    console.log(data);
    if (data == 1) {
      var params = {
        url: '/roomorderdone',
        type: 'post',
        data:{roomorder:wx.getStorageSync('orderid')},
        sCallback: function (res) {
          wx.showModal({
            title: '预定房间成功!',
            content: '立即前往点餐吧(*^_^*)！',
            showCancel: true,
            success: function (res) {
              console.log('kkkkkkkkkkkkkkk');
              wx.navigateTo({
                url: '../category/category'
              });
            }
            
          });
        }
      }
      this.request(params);
    }else{
      wx.showModal({
        title: '付款失败!',
        content: '亲在考虑下/(ㄒoㄒ)/~~！',
        showCancel: true,
        success: function (res) {
        console.log(res);
       }
      });
    }
  }

}
export { Roomdetail };