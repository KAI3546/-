/**
 * Created by jimmy on 17/3/24.
 */
import {Base} from '../../utils/base.js'

class My extends Base{
    constructor(){
        super();
    }

    //得到用户信息
    getUserInfo(cb){
        var that=this;
        wx.login({
            success: function () {
                wx.getUserInfo({
                    success: function (res) {
                        typeof cb == "function" && cb(res.userInfo);

                        //将用户昵称 提交到服务器
                        if(!that.onPay) {
                            that._updateUserInfo(res.userInfo);
                        }

                    },
                    fail:function(res){
                        typeof cb == "function" && cb({
                            avatarUrl:'../../imgs/icon/user@default.png',
                            nickName:'零食小贩'
                        });
                    }
                });
            },

        })
    }

    /*更新用户信息到服务器*/
    _updateUserInfo(res){
        var nickName=res.nickName;
        delete res.avatarUrl;  //将昵称去除
        delete res.nickName;  //将昵称去除
        var allParams = {
            url: 'user/wx_info',
            data:{nickname:nickName,extend:JSON.stringify(res)},
            type:'post',
            sCallback: function (data) {
            }
        };
        this.request(allParams);

    }


    getOrderInfo(kai,callback){
      this.getInfo2('yroom',wx.getStorageSync('userid'),'*',(res)=>{
        console.log('res===22222222222222222222222');
        console.log(res);
        console.log(res[0].Yrid);
        var arr=[];
        for (let b = 0; b <res.length;b++){
        var params={
          url:'Roomdetail/'+res[b].Yrid,
          sCallback: function (data) {
            console.log('data=========================');
            console.log(data);
            arr.push.apply(arr,data);
            kai.setData({
              orderArr:arr
            })
          }
        }
        this.request(params);
        }
        callback&&callback(res);
      })
    }

    getInfo2(table,userid,need,callback){
      var params = {
        url: 'getInfo2',
        type: 'post',
        data: { table: table, userid: userid, need: need },
        sCallback: function (res) {
          callback && callback(res);
        }
      }
      this.request(params);
    }

}



export {My};