import { Order } from '../order/ordermodel.js';
import { Cart } from '../cart/cartmodel.js';

var order = new Order();
var cart = new Cart();

Page({
  data: {
    productsArr:[],
    fromCartFlag: true
  },

  /*
  * 订单数据来源包括两个：
  * 1.购物车下单
  * 2.旧的订单
  * */
  onLoad: function (options) {
    var flag = options.from == 'cart',
      that = this;
    this.data.fromCartFlag = flag;
    this.data.account = options.account;
    console.log(this.data.account);
    //来自于购物车
    if (flag) {
      this.setData({
        productsArr: cart.getCartDataFromLocal(true),
        account: options.account,
        orderStatus: 0
      });
    }
    //旧订单
    else {
      var kai = this;
      this.data.id = options.id;
      order.getOrderInfo(kai,(res)=>{
          for(let a=0;a<res.length;a++){
            console.log(res[a].Cid);
            order.getInfo('menu','Mid='+res[a].Cid,'*',(data)=>{
              data[0].Mpath ='http://www.ktzstudio.top/hotelmanger/Admin/'+data[0].Mpath;
              data[0].counts=res[a].Ccount;
              var str = kai.data.productsArr.concat(data);
              kai.setData({
                productsArr:str
              })
              console.log(data);
            })
          }

      })
      order.getOrderStatus(kai,(res)=>{
        kai.setData({
          account:res[0].Yaccount,
          orderStatus:res[0].Ystate
        })
      })

    }

  },

  onShow: function () {
    // if (this.data.id) {
    //   var that = this;
    //   //下单后，支付成功或者失败后，点左上角返回时能够更新订单状态 所以放在onshow中
    //   var id = this.data.id;
    //   order.getOrderInfoById(id, (data) => {
    //     that.setData({
    //       orderStatus: data.status,
    //       productsArr: data.snap_items,
    //       account: data.total_price,
    //       basicInfo: {
    //         orderTime: data.create_time,
    //         orderNo: data.order_no
    //       },
    //     });

    //   });
    // }
  },
  /*下单和付款*/
  pay: function () {
    // if (!this.data.addressInfo) {
    //   this.showTips('下单提示', '请填写您的收货地址');
    //   return;
    // }
    if (this.data.orderStatus == 0 ){
      this._firstTimePay();
    } else {
      this._oneMoresTimePay();
    }
  },

  /*第一次支付*/
  _firstTimePay: function () {
    var orderInfo = [],
      procuctInfo = this.data.productsArr,
      order = new Order();
    for (let i = 0; i < procuctInfo.length; i++) {
      orderInfo.push({
        product_id: procuctInfo[i].Mid,
        count: procuctInfo[i].counts
      });
    }
    console.log('orderinfo===');
    console.log(orderInfo);
    var that = this;
    //支付分两步，第一步是生成订单号，然后根据订单号支付
    order.doOrder(that,this.data.account,orderInfo, (data) => {
      console.log('data222222222222222222');
      console.log(data);
      //订单生成成功
      if (data) {
        //更新订单状态
        var id = data;
        that.data.id = id;
        that.data.fromCartFlag = false;
        
        //开始支付
        that._execPay(id);
      } else {
        //that._orderFail(data);  // 下单失败
      }
    });
  },


  /*
  * 提示窗口
  * params:
  * title - {string}标题
  * content - {string}内容
  * flag - {bool}是否跳转到 "我的页面"
  */
  showTips: function (title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {
        if (flag) {
          wx.switchTab({
            url: '/pages/my/my'
          });
        }
      }
    });
  },

  /*
  *下单失败
  * params:
  * data - {obj} 订单结果信息
  * */
  _orderFail: function (data) {
    var nameArr = [],
      name = '',
      str = '',
      pArr = data.pStatusArray;
    for (let i = 0; i < pArr.length; i++) {
      if (!pArr[i].haveStock) {
        name = pArr[i].name;
        if (name.length > 15) {
          name = name.substr(0, 12) + '...';
        }
        nameArr.push(name);
        if (nameArr.length >= 2) {
          break;
        }
      }
    }
    str += nameArr.join('、');
    if (nameArr.length > 2) {
      str += ' 等';
    }
    str += ' 缺货';
    wx.showModal({
      title: '下单失败',
      content: str,
      showCancel: false,
      success: function (res) {

      }
    });
  },

  /* 再次次支付*/
  _oneMoresTimePay: function () {
    this._execPay(this.data.id);
  },

  /*
  *开始支付
  * params:
  * id - {int}订单id
  */
  _execPay: function (id) {
    var kai = this;
    order.execPay(id,this.data.account,kai,(data) => {
      console.log('data========');
      console.log(data);
      if (data != 0) {
        
      }
    });
  },

  //将已经下单的商品从购物车删除
  deleteProducts: function () {
    var ids = [], arr = this.data.productsArr;
    for (let i = 0; i < arr.length; i++) {
      ids.push(arr[i].Mid);
    }
    cart.delete(ids);
  },


}
)