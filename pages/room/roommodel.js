import {Base} from "../../utils/base.js";

class room extends Base{
  constructor(){
    super();
  }
  
  getRoomcataData(id,callback){
    console.log('kaikai');
    var params = {
      url: '/RoomCate/'+id,
      sCallback: function (res) {
        callback && callback(res);
      }
    }
    console.log(params);
    this.request(params);
  }


}
export { room };