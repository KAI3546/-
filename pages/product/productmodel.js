import {Base} from "../../utils/base.js";

class Product extends Base{
  constructor(){
    super();
  }

  getDetailInfo(id,callback){
    var param = {
      url:'/MenuByid/'+id,
      sCallback:function(data){
        callback&&callback(data);
      }
    };
    this.request(param);
  }

};
export {Product};
