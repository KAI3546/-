// pages/roomdetail/roomdetail.js
import { Roomdetail } from 'roomdetailmodel.js';
var room = new Roomdetail();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    date:null,
    stagearr:['中午12:00','晚上19:00'],
    currentTabsIndex: 0,
    datestage:"",
    stage:"",
    orderstatus:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var id = options.id;
      this.data.id=id;
      console.log(id);
      this._loadData();
  },
  _loadData:function(){
   
    var d=[];
    for(var i=0;i<7;i++)
    {
      d[i]=room.GetDateStr(i);
    }
    this.setData({
      date: d,
      index:d[0]
    });

    room.getroomdetail(this.data.id, (res) => {
      for (var a = 0; a < res.length; a++) {
        res[a].RPath = 'http://www.ktzstudio.top/hotelmanger/Admin/' + res[a].RPath;
      }
      console.log(res);
      this.setData({
        'roomdetail': res
      });
    });
    
  },
  onTabsItemTap: function (event) {
    var index = room.getDataset(event, 'index');
    this.setData({
      currentTabsIndex: index
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      datestage: this.data.date[e.detail.value],
    })
  },
  bindPickerChangeC:function(e){
    var stage='请选择';
    if(e.detail.value==0)
    {
      stage='中午12:00'
    }
    if (e.detail.value == 1) {
      stage = '晚上19:00'
    }
    this.setData({
      stage: stage,
    })
  },
  submitroom:function(){
    if(this.data.datestage&&this.data.stage){
    wx.setStorageSync('roomid',this.data.id);
    wx.setStorageSync('date',this.data.datestage);
    wx.setStorageSync('stage',this.data.stage);
    var account = this.data.roomdetail['0'].Rprice;
    var that = this;
    room.submitorder(that,(res)=>{
      if(res){
        this.data.orderstatus=1;
        wx.showModal({
          title: '订单提交成功!',
          content: '立即前往支付',
          showCancel: true,
          success: function (res) {
            that.payroomorder();          
          }
        });
      }
    })    

  }else{
      wx.showModal({
        title: '错误',
        content: '请选择预定的日期时间',
        showCancel: false,
        success: function (res) {

        }
      });
  }
  }
  ,
  payroomorder:function(){
    var that = this;
    var timestamp = Date.parse(new Date())/1000;
    console.log(timestamp);
    room.dowxpay(that);
  }

  
})