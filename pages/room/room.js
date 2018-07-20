// pages/room/room.js
import {room} from 'roommodel.js';
var room1 = new room();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    var id = options.id;
    var name = options.name;
    console.log(id+name);
    this.data.id = id;
    this.data.name = name;
    
    this._loadData();
  },
  onReady:function(){
    wx.setNavigationBarTitle({
      title: this.data.name,
    })
  },

  _loadData:function(){
    var Qurl ='http://www.ktzstudio.top/hotelmanger/Admin/';

    room1.getRoomcataData(this.data.id,(res)=>{

      for (var a = 0; a < res.length; a++){
        res[a].RPath = Qurl + res[a].RPath;
        res[a].zimg = Qurl + res[a].zimg;
      }
      console.log(res);
      this.setData({
        'roomcate': res
      });
    });
  },
  onroomTouch:function(event){
    var id = room1.getDataset(event,'id');
    wx.navigateTo({
      url: '../roomdetail/roomdetail?id='+id,
    })
  }

})