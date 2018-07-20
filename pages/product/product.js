// pages/product/product.js
import {Product} from 'productmodel.js';
import { Cart } from '../cart/cartmodel.js';
var cart = new Cart();
var product = new Product();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    currentTabsIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.data.id = id;
    this._loadData();
  },
  _loadData:function(){
    var Qurl = 'http://www.ktzstudio.top/hotelmanger/Admin/';
    product.getDetailInfo(this.data.id,(data)=>{
      data.Mpath = Qurl + data.Mpath;
      console.log(data);
      this.setData({
        product:data
      });
    });

  },
  onTabsItemTap: function (event) {
    var index = product.getDataset(event, 'index');
    this.setData({
      currentTabsIndex: index
    });
  },
  onAddingToCartTap:function(events){
    this.addToCart();
  },
  addToCart:function(){
    var tempObj={},keys=['Mid','Mname','Mpath','Mprice'];
    for(var key in this.data.product){
      if(keys.indexOf(key)>=0)
      {
        tempObj[key]=this.data.product[key];
      }
    }
    wx.showModal({
      title: '提示',
      content: '加入菜单成功(*^_^*)！',
      showCancel: false,
      success: function (res) {

      }
    });
    console.log('tempObj=');
    console.log(tempObj);
    cart.add(tempObj,1);
  },
  
})