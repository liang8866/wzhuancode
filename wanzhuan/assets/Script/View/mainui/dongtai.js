
cc.Class({
    extends: cc.Component,

    properties: {
        
        itemLayoutNode: { 
            default: null,
            type: cc.Node
        },
        item_prefab:{  //项的资源预制体
            type:cc.Prefab,
            default:null,
        },
        contentNode:{
            default: null,
            type: cc.Node
        },
        contentView:{
            default: null,
            type: cc.Node
        },
        chaojiView:{
            default: null,
            type: cc.Node
        },
        super_prefab:{  //项的资源预制体
            type:cc.Prefab,
            default:null,
        },
        super_count:-1,//当前是第几条数据
        isFirstIn:true,
        superItem:null,
    },
    

    // LIFE-CYCLE CALLBACKS:
    onLoad()
    {
        this.height = 400;
        if (cc.getIsIphoneX() == true) {
            this.height  = 400 + cc.iphone_off_Y*2;
            this.contentNode.setContentSize(this.contentNode.getContentSize().width,this.contentNode.getContentSize().height + cc.iphone_off_Y*2);
            this.contentView.setContentSize(this.contentView.getContentSize().width,this.contentView.getContentSize().height + cc.iphone_off_Y*2);
        }
       
        this.showSuperMessgae();
        
    },
    start () {
        this.count = 0;
        this.itemList = [];
        this.super_count = -1;
         this.onGetMessage();

        // cc.log("============cc.UserInfo.messageList.length=======",cc.UserInfo.messageList.length)
        // if (cc.UserInfo.messageList.length > 0) {
        //     this.onShowScrollItem();
        // }else{
        //    // this.onGetMessage();
        // }
       
    },
    
    onGetMessage(){
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                      cc.log("========onGetMessage====dongtai=======",ret)
                     var messgae =  ret.data.message
                     for (let index = messgae.length-1; index >=0; index--) {
                        const element = messgae[index];
                        cc.UserInfo.messageList.unshift(element);
                     }
                    self.onShowScrollItem();
                    var supermessgae =  ret.data.super_message
                    for (let index = supermessgae.length-1; index >=0; index--) {
                        const element = supermessgae[index];
                        cc.UserInfo.super_messageList.unshift(element);
                    }
                   // cc.log("============messgae=======",messgae)
                    var max = 30;
                    if (cc.UserInfo.super_messageList.length > max) {
                        var len = cc.UserInfo.super_messageList.length;
                        cc.UserInfo.super_messageList.splice(max,len);
                    }
                    cc.sys.localStorage.setItem('superdongtaimessage',  JSON.stringify(cc.UserInfo.super_messageList));
                    //cc.log("==============self.super_count =",self.super_count)
                    if (self.super_count == -1) {
                      
                        self.showSuperMessgae()
                    }

                }
            }
        };
      
        //请求偷的信息信息的
        var maxid = "0";
        

        if (cc.UserInfo.messageList.length>0) {
            maxid = this.getMaxId();
        }
        if (this.isFirstIn) {
            maxid = "0";
            this.isFirstIn = false;
        }
        var psObjdata = {
            max_id:maxid,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        // cc.log("===========dongtai=psdata=======",psdata)
        HttpHelper.httpPostMessage(cc.UrlTable.url_hb_getmessage,psdata,onPostCallBack,this);
    },
    getMaxId(){
        var maxId =  cc.UserInfo.messageList[0].id;
        for (let index = 0; index < cc.UserInfo.messageList.length; index++) {
            const element = cc.UserInfo.messageList[index];
            if (parseInt(element.id) > parseInt(maxId) ) {
                maxId = element.id;
            }
        }
        // for (let index = 0; index < cc.UserInfo.super_messageList.length; index++) {
        //     const element = cc.UserInfo.super_messageList[index];
        //     if (parseInt(element.id) > parseInt(maxId) ) {
        //         maxId = element.id;
        //     }
        // }
        return maxId
    },
    onShowScrollItem(){
        
        for (let index = 0; index < this.itemList.length; index++) {
            const element = this.itemList[index];
            element.destroy();
        }
        this.itemList= [];
        var max = 15;
        if (cc.UserInfo.messageList.length > max) {
            var len = cc.UserInfo.messageList.length;
            cc.UserInfo.messageList.splice(max,len);
        }
       
        cc.sys.localStorage.setItem('myuserdongtaidata',  JSON.stringify(cc.UserInfo.messageList));

       // cc.log("========22222====cc.UserInfo.messageList=======",cc.UserInfo.messageList);
         for (let index = 0; index <  cc.UserInfo.messageList.length; index++) {
            const elementdata = cc.UserInfo.messageList[index];
            var item = cc.instantiate(this.item_prefab);
            this.itemLayoutNode.addChild(item);
            var script = item.getComponent('messageLayout');
            script.showUi(elementdata);
            this.itemList.push(item);//保存起来
        }
        

        this.contentNode.height = this.itemList.length *50;
        if ( this.contentNode.height < this.height) {
            this.contentNode.height = this.height;
        }
        var itemLayout =  this.itemLayoutNode.getComponent(cc.Layout);
        itemLayout.updateLayout();
    },
    
    showSuperMessgae()
    {
        //cc.log("==============self.super_count =",self.super_count)
        for (let index = 0; index <1; index++) {
            const element = cc.UserInfo.super_messageList[index];
           // cc.log("==============element= ",index,element);
            if (element != null) {
                //cc.log("======222========element= ",element);
                var item1 = this.createOneSuperMessage(element)
              
               
            }
        }
       
    },
    createOneSuperMessage()
    {
       // cc.log("=============this.super_count",this.super_count)
        var itemdata = cc.UserInfo.super_messageList[this.super_count];
        if (itemdata == null && this.superItem != null) {
            return
        }
        var item = cc.instantiate(this.super_prefab);
        var script = item.getComponent('cjmessageLayout');
        script.showUi(itemdata);
        this.chaojiView.addChild(item);
        item.setPosition(0,-32 );
        this.superItem = item;
        var t =1.0;
        var act1 = cc.moveBy(t,cc.v2(0,32));
        var delayAct  = cc.delayTime(1.0)
        var act2 = cc.moveBy(t,cc.v2(0,40));

        var self  = this;
        var seq = cc.sequence(act1,delayAct,act2,cc.callFunc(function(){
            item.destroy();
            self.superItem = null;
            self.createOneSuperMessage();
            
            })
          );
          item.runAction(seq)

        this.super_count = this.super_count +1;
        if (this.super_count >= cc.UserInfo.super_messageList.length) {
            this.super_count = 0;
        }
        return item
    },


    update (dt) {
        this.count = this.count + dt;
        if (this.count >= 30) {
            var itemLayout =  this.itemLayoutNode.getComponent(cc.Layout);
            itemLayout.updateLayout();
            this.onGetMessage();
            this.count = 0;
        }


    },


});
