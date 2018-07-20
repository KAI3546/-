import {Home} from 'homemodel.js';
import {Cart} from '../cart/cartmodel.js'
var home = new Home();
var cart = new Cart();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  
  onLoad:function(){
    home.getUserOpenid();
    this._loadData();
  },

  _loadData:function(){
    //home.getUserOpenid();
    var Qurl = 'http://www.ktzstudio.top/hotelmanger/Admin/';
    home.getBannerData((res)=>{
    for(var a=0;a<res.length;a++)
    {
      res[a].Mimg = Qurl + res[a].Mimg ;
    }
    console.log(res);
    this.setData({
      'bannerArr':res
    });
   }); 

    home.getBannerData2((res) => {
      for (var a = 0; a < res.length; a++) {
        res[a].RImg = Qurl + res[a].RImg;
      }
      console.log(res);
      this.setData({
        'bannerArr2': res
      });
    }); 

    home.getRoomData((res)=>{
      for (var a = 0; a < res.length; a++) {
        res[a].RImg = Qurl + res[a].RImg;
      }
      this.setData({
        'roomArr':res
      });
    });

    home.getRoomData((res) => {
      for (var a = 0; a < res.length; a++) {
        res[a].RImg = Qurl + res[a].RImg;
      }
      this.setData({
        'roomArr': res
      });
    });

    home.getMenuData((res) => {
      for (var a = 0; a < res.length; a++) {
        res[a].Mpath = Qurl + res[a].Mpath;
      }
      this.setData({
        'menuArr': res
      });
    });
    cart.haveroom((res)=>{
      if(res){
        wx.setStorageSync('haveroom', true)
      }else{
        wx.setStorageSync('haveroom', false)
      }

    })

  },

  onProductsItemTap:function (event){
    console.log(event);
    var id = home.getDataset(event,'id');
    wx.navigateTo({
      url: '../product/product?id='+id,
    })
  },
  onroomItemTap: function (event) {
    console.log(event);
    var id = home.getDataset(event, 'id');
    var name = home.getDataset(event,'name');
    console.log(name);
    wx.navigateTo({
      url: '../room/room?id=' + id+'&name='+name,
    })
  },
  onmenuItemTap: function (event) {
    var id = home.getDataset(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  }
})