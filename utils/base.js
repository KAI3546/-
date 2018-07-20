import { Config } from '../utils/config.js';
class Base{
  constructor(){
    this.baseRequestUrl = Config.restUrl;
  }

  request(params, noRefetch) {
    var that = this,
      url = this.baseRequestUrl + params.url;
    if (!params.type) {
      params.type = 'get';
    }
    /*不需要再次组装地址*/
    if (params.setUpUrl == false) {
      url = params.url;
    }
    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (params.sCallback) {
          params.sCallback(res.data);
        }
      },
      fail: function (err) {
        console.log(err);
      }
    });
  }

  getDataset(event,key){
    return event.currentTarget.dataset[key];
  };

  getInfo(table,condition,need,callback){
    var params = {
      url: 'getInfo',
      type: 'post',
      data: { table: table, condition: condition, need: need },
      sCallback: function (res) {
        callback && callback(res);
      }
    }
    this.request(params);
  }

}
export {Base};