/**
 * Created by jimmy on 17/03/09.
 */

import { Base } from '../../utils/base.js'

class Order extends Base {

  constructor() {
    super();
    this._storageKeyName = 'newOrder';
  }

  doOrder(kai, account, param, callback) {
    var that = this;
    var userid = wx.getStorageSync('userid');
    console.log('userid==');
    console.log(userid);
    if (kai.data.fromCartFlag) {
      var allParams = {
        url: 'ordersubmit',
        type: 'post',
        data: { products: param, userid: userid, account: account },
        sCallback: function (data) {
          console.log('/////////////////////');
          console.log(data);
          callback && callback(data);
        },
        eCallback: function () {
        }
      };
      console.log(allParams);
      this.request(allParams);
    }else{
      callback&&callback(1);
    }
  }

  execPay(orderNumber, account, kai, callback) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    console.log('price==' + account);
    var params = {
      url: 'orderpay',
      type: 'post',
      data: { orderid: orderNumber + 10000, openid: openid, price: account },
      sCallback: function (res) {
        that.wxpay(res, kai);
        console.log('continue');
        callback && callback(res);
      }
    }
    this.request(params);
  }

  wxpay(res, kai) {
    var that = this;
    console.log('res==================================');
    console.log(res);
    wx.requestPayment({
      timeStamp: res.timeStamp,
      nonceStr: res.nonceStr,
      package: res.package,
      signType: 'MD5',
      paySign: res.paySign,
      success: function (data) {
        kai.setData({
          orderStatus: 1
        })
        that.donepay(1);
        kai.deleteProducts(); //将已经下单的商品从购物车删除   当状态为0时，表示
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + kai.data.id + '&from=order'
        });
      },
      fail: function () {

        kai.setData({
          orderStatus: 0
        });
        wx.navigateTo({
          url: '../pay-result/pay-result?' + 'from=order'
        });
      }
    })
  }

  donepay(result) {
    var orderid = wx.getStorageSync('orderid');
    if (result == 1) {
      var params = {
        url: 'donemenuorder/' + orderid,
        sCallback: function (res) {
          console.log('更新菜单状态成功!');
          console.log(res);
        }
      }
      this.request(params);
    } else {
      console.log('更新菜单状态失败！');
    }

  }


  getOrderInfo(kai, callback) {
    this.getInfo('dcai', 'Rid=' + kai.data.id, '*', (res) => {
      callback && callback(res);
    })
  }

  getOrderStatus(kai, callback) {
    this.getInfo('yroom', 'Yid=' + kai.data.id, '*', (res) => {
      callback && callback(res);
    })
  }

}

export { Order };