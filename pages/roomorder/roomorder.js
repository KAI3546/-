// pages/roomorder/roomorder.js
import { Roomorder } from '../roomorder/roomordermodel.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取传递过来的信息
    var flag = options.from == 'roomdetail',
      that = this;
    this.data.fromroomdetail=flag;
    var account = this.data.account;
    var date = wx.getStorageSync('date');
    var stage = wx.getStorageSync('stage');

    if(flag){
      this.setData({
        date:date,
        stage:stage,
        account: options.account,
        orderStatus: 0
      });
    }else{

    }



  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    roomorder.Doorder
  }

})