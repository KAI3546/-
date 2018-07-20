
Page({
        data: {
        },
        onLoad: function (options){
          if(options.id)
          {
            this.setData({
              Status:true
            })
          }else{
            this.setData({
              Status:false
            })
          }
            console.log(options);
        },
        viewOrder:function(){
            if(this.data.from=='my'){
                wx.redirectTo({
                    url: '../order/order?from=order&id=' + this.data.id
                });
            }else{
                //返回上一级
                wx.navigateBack({
                    delta: 1
                })
            }
        }
    }
)