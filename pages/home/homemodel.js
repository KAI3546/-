import {Base} from '../../utils/base.js';
import { Config } from '../../utils/config.js';
class Home extends Base{
  constructor(){
    super()
  }

  getBannerData(callback){
    var params = {
      url: '/Banner/',
      sCallback:function(res){
      callback && callback(res);
      }
    }
    this.request(params);
    }

   getBannerData2(callback){
     var params = {
       url: '/Rcate/2',
       sCallback: function (res) {
         callback && callback(res);
       }
     }
     this.request(params);
   } 

  getRoomData(callback){
    var param = {
      url:'/Rcate/3',
      sCallback:function(data){
        callback &&callback(data);
      }
    }
    this.request(param);
  }

  getMenuData(callback) {
    var param = {
      url: '/Menu/6',
      sCallback: function (data) {
        callback && callback(data);
      }
    }
    this.request(param);
  }

  getUserOpenid() {
    var that =this;
    var appid = Config.appid;
    var secret = Config.secret;
    wx.login({
      success: function (res) {
        console.log('res=!!');
        console.log(res);
        wx.getUserInfo({
          success: function (data) {
            console.log(data);
            wx.setStorageSync('nickName',data.userInfo.nickName);
            wx.setStorageSync('avatarUrl', data.userInfo.avatarUrl);
          },
          fail: function (data) {
            console.log("fail=");
            console.log(data);
          }
        });
        var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code';
        wx.request({
          url: url,
          data:{},
          method:'GET',
          success:function(res){
            console.log('res===');
            console.log(res);
            console.log(res.data.openid);            
            wx.setStorageSync('openid', res.data.openid);
            var openid = res.data.openid;
            that.SaveIntoUser(openid, (res) => {
              wx.setStorageSync('userid', res);
            }) 
          }
        })
      }
    })
  } 

  SaveIntoUser(openid,callback){
    var param = {
      url: '/UseidSave/'+openid,
      sCallback: function (data) {
        callback && callback(data);
      }
    }
    this.request(param);
  }


}

export {Home};