import { Base } from '../../utils/base.js';

class Category extends Base {
  constructor() {
    super();
  }

  getmenuCate(callback){
    var param = {
      url:'/Mcate/12',
      sCallback:function(data){
        callback && callback(data);
      }
    };
    this.request(param);
  }

  getpruductCate(id,callback){
    var param = {
      url:'/MenuCate/'+id,
      sCallback:function(data){
        callback && callback(data);
      }
    };
    this.request(param);
  }
}

export {Category};
