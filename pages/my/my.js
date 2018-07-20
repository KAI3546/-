import {Order} from '../order/ordermodel.js';
import {My} from '../my/mymodel.js';

var order=new Order();
var my=new My();

Page({
    data: {
        pageIndex:1,
        isLoadedAll:false,
        loadingHidden:false,
        orderArr:[],
        addressInfo:null,
        userInfo:[],
        orderInfo:[]
    },
    onLoad:function(){
        this._loadData();
    },

    onShow:function(){
        //更新订单,相当自动下拉刷新,只有  非第一次打开 “我的”页面，且有新的订单时 才调用。
      var kai = this;
      my.getOrderInfo(kai, (res) => {
        console.log('res===1');
        console.log(res);
        kai.setData({
          orderInfo: res
        })
      });

        
    },

    _loadData:function(){
        var that=this;
        var kai = this;
        console.log('****************************************');
        var a=new Array();
        a.push('huang');
        a.push('kai');
        console.log(a);
        console.log('****************************************');

        var kai = this;
        my.getOrderInfo(kai, (res) => {
          console.log('res===1');
          console.log(res);
          kai.setData({
            orderInfo: res
          })
        });





        




        // my.getOrderInfo(kai,(res)=>{
        //   console.log('res===1');
        //   console.log(res);
        //   that.setData({
        //     orderInfo:res
        //   })
        // });
        that.setData({
          avatarUrl:wx.getStorageSync('avatarUrl'),
          nickName:wx.getStorageSync('nickName')
        });
        console.log(this.data.orderArr);
        

        this._getOrders();
    },


    /*订单信息*/
    _getOrders:function(callback){
        var that=this;
       
    },

    /*显示订单的具体信息如果未点餐跳转到菜单界面*/
    showOrderDetailInfo:function(event){
        var id=order.getDataset(event,'id');
        for(let a=0;a<this.data.orderInfo.length;a++){
          if(id==this.data.orderInfo[a].Yid){
            if (this.data.orderInfo[a].Ystate==-1){
              this.showTips('提示', '请前往菜单进行点餐!');
            }else{
              wx.navigateTo({
                url: '../order/order?from=order&id=' + id
              });
            }
          }
        }
        
    },

    /*未支付订单再次支付*/
    rePay:function(event){
        var id=order.getDataSet(event,'id'),
            index=order.getDataSet(event,'index');

        //online 上线实例，屏蔽支付功能
        if(order.onPay) {
            this._execPay(id,index);
        }else {
            this.showTips('支付提示','本产品仅用于演示，支付系统已屏蔽');
        }
    },

    /*支付*/
    _execPay:function(id,index){
        var that=this;
        order.execPay(id,(statusCode)=>{
            if(statusCode>0){
                var flag=statusCode==2;

                //更新订单显示状态
                if(flag){
                    that.data.orderArr[index].status=2;
                    that.setData({
                        orderArr: that.data.orderArr
                    });
                }

                //跳转到 成功页面
                wx.navigateTo({
                    url: '../pay-result/pay-result?id='+id+'&flag='+flag+'&from=my'
                });
            }else{
                that.showTips('支付失败','商品已下架或库存不足');
            }
        });
    },

    /*下拉刷新页面*/
    onPullDownRefresh: function(){
        var that=this;
        this.data.orderArr=[];  //订单初始化
        this._getOrders(()=>{
            that.data.isLoadedAll=false;  //是否加载完全
            that.data.pageIndex=1;
            wx.stopPullDownRefresh();
            order.execSetStorageSync(false);  //更新标志位
        });
    },


    onReachBottom:function(){
        if(!this.data.isLoadedAll) {
            this.data.pageIndex++;
            this._getOrders();
        }
    },

    /*
     * 提示窗口
     * params:
     * title - {string}标题
     * content - {string}内容
     * flag - {bool}是否跳转到 "我的页面"
     */
    showTips:function(title,content){
        wx.showModal({
            title: title,
            content: content,
            showCancel:false,
            success: function(res) {

            }
        });
    },

})