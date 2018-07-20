// pages/category/category.js
import { Category } from 'categorymodel.js';
var category = new Category(); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    transClassArr: ['tanslate0', 'tanslate1', 'tanslate2',      'tanslate3', 'tanslate4', 'tanslate5'],
    currentMenuIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  _loadData: function (callback) {
    var that = this;
    var Qurl = 'http://www.ktzstudio.top/hotelmanger/Admin/';
    category.getmenuCate((res)=>{
      for (var a = 0; a < res.length; a++){
        res[a].Mimg = Qurl + res[a].Mimg;
      }
      that.setData({
        menucate:res
      });
      category.getpruductCate(res[0].MCid,(data)=>{
        for (var a = 0; a < data.length; a++) {
          data[a].Mpath = Qurl + data[a].Mpath;
        }
        var dataObj={
          products:data,
          topImgUrl:res[0].Mimg,
          title:res[0].MCname
        };
        this.setData({
          categoryInfo0: dataObj
        });
        callback&& callback();
      });


    });
  },

  changeCategory: function (event) {
    var index = category.getDataset(event, 'index'),
      id = category.getDataset(event, 'id')//获取data-set
    this.setData({
      currentMenuIndex: index
    });
    if (!this.isLoadedData(index)) {
      var that = this;
      category.getpruductCate(id, (data) => {
        that.setData(that.getDataObjForBind(index, data));
      });
    }
  },
  isLoadedData: function (index) {
    if (this.data['categoryInfo' + index]) {
      return true;
    }
    return false;
  },
  getDataObjForBind: function (index, data) {
    var obj = {},arr = [0, 1, 2, 3, 4, 5],
    baseData = this.data.menucate[index];
    for (var a = 0; a < data.length; a++) {
      data[a].Mpath = 'http://www.ktzstudio.top/hotelmanger/Admin/' + data[a].Mpath;
    }
    for (var item in arr) {
      if (item == arr[index]) {
        obj['categoryInfo' + item] = {
          products: data,
          topImgUrl: baseData.Mimg,
          title: baseData.MCname
        };
        return obj;
      }
    }
  },
  getProductsByCategory: function (id, callback) {
    category.getpruductCate(id, (data) => {
      callback && callback(data);
    });
  },
  onProductsItemTap: function (event) {
    var id = category.getDataset(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  }
})