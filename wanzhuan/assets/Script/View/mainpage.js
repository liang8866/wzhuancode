
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        page1_prefab:{  //项的资源预制体
            type:cc.Prefab,
            default:null,
        },
        page2_prefab:{  //项的资源预制体
            type:cc.Prefab,
            default:null,
        },
        maskBtnNode:cc.Node,
        
        downNode:cc.Node,
        day:-1,
        Flag:false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       this.isShowBanner = false;    
       this.layerNode1 = cc.UITools.findNode(cc.rootpanel,"layer1");
       this.layerNode2 = cc.UITools.findNode(cc.rootpanel,"layer2");
       this.layerNode3 = cc.UITools.findNode(cc.rootpanel,"layer3");
       this.layerNode4 = cc.UITools.findNode(cc.rootpanel,"layer4");
       this.layerNode5 = cc.UITools.findNode(cc.rootpanel,"layer5");
       this.layerNode1.active = true;
       this.layerNode2.active = true;
       this.layerNode3.active = true;
       this.layerNode4.active = true;
       this.layerNode5.active = true;
    
       this.layerNode1.x = -10000;
      // this.layerNode2.x = -10000;
       this.layerNode3.x = -10000;
       this.layerNode4.x = -10000;
       this.layerNode5.x = -10000;

    //     var layerNode1 = cc.UITools.findNode(cc.rootpanel,"layer1");
    //     cc.myShowView(cc.PanelID.FUSHU_PAGE,1,layerNode1,laodCallBack);

    //    var layerNode2 = cc.UITools.findNode(cc.rootpanel,"layer2");
    //    cc.myShowView(cc.PanelID.MAIN_YANGLONG,1,layerNode2,null);

        // var layerNode3 = cc.UITools.findNode(cc.rootpanel,"layer3");
        // cc.myShowView(cc.PanelID.MAIN_SY,1,layerNode3,null);

    //    var layerNode5 = cc.UITools.findNode(cc.rootpanel,"layer5");
    //    cc.myShowView(cc.PanelID.PERSON_CNTER,1,layerNode5,null);
       // cc.log("1 main page  ",this.node.x,this.node.y, this.downNode.x, this.downNode.y,cc.iphone_off_Y)
       if (cc.getIsIphoneX() == true) {
           
            this.downNode.y = this.downNode.y - cc.iphone_off_Y*2;
        }
        //cc.log("2 main page  ",this.node.x,this.node.y, this.downNode.x, this.downNode.y,cc.iphone_off_Y)
     
       

        var messageList = "";//JSON.parse(cc.sys.localStorage.getItem('myuserdongtaidata'));
        var supermessageList = JSON.parse(cc.sys.localStorage.getItem('superdongtaimessage'));
        //cc.log("============== messageList  ",messageList)
        if (messageList == null ||messageList == "") {
            this.onGetMessage();
        }else{
            cc.UserInfo.messageList = messageList;
        }
       
        
       var myDate = new Date();
       var day = myDate.getDate();
       //cc.log("============== day  ",this.day,day)
       this.day = day;

       
    //    if (cc.UserInfo.guideStep == 0) {
    //        var self  = this;
    //        var loadGuideCall = function()
    //        {
    //          self.maskBtnNode.active = false;
    //        }
    //      cc.myShowView(cc.PanelID.GUIDE_MAINPAGE,30,null,loadGuideCall);
    //     }else{
    //         this.maskBtnNode.active = false;
    //     }
        this.maskBtnNode.active = false;

    },
    setOnLoadCallBack(callBack){//设置回调
       this.comeinCallBack = callBack;
       
    },

    getLayerByIndx(idx){
        var layerNode = cc.UITools.findNode(cc.rootpanel,"layer"+idx);
        return layerNode;
    },

    onClickDownBtn:function(event, customEventData) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
        var downlayer = cc.UITools.findNode(cc.rootpanel,"downlayer");
        cc.onDestoryView(cc.PanelID.STEALPAGE); 
        for (var i = 1; i <6; i++) {
            var mbtn = cc.UITools.findButton(downlayer,"m_btn"+i);
            var layer = cc.UITools.findNode(cc.rootpanel,"layer"+i);
            layer.x  =-10000;
            mbtn.interactable = true;
            if (customEventData == i) {
                layer.x  = 0;
                mbtn.interactable = false;
                if (i == 3) {
                    var syScript = cc.getPageSriptByIndx(3);
                    syScript.onGetPostData();
                }
                if (i==2) {
                    cc.UserInfo.guideClick = true;//第6步点养龙界面
                }
               
            }
        };
       
    },

 
    onGetMessage(){
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                     cc.log("============dongtai==page1======",ret,ret.data.length)
                    var messgae =  ret.data.message
                    // for (let index = messgae.length-1; index >=0; index--) {
                    //    const element = messgae[index];
                    //    cc.UserInfo.messageList.unshift(element);
                    // }
                    var supermessgae =  ret.data.super_message
                    for (let index = supermessgae.length-1; index >=0; index--) {
                        const element = supermessgae[index];
                        cc.UserInfo.super_messageList.unshift(element);
                    }
                 
                    var max = 30;
                    if (cc.UserInfo.super_messageList.length > max) {
                        var len = cc.UserInfo.super_messageList.length;
                        cc.UserInfo.super_messageList.splice(max,len);
                    }
                }
            }
        };
      
        //请求偷的信息信息的
        var maxid = "1";
        var psObjdata = {
            max_id:maxid,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        // cc.log("============psdata=======",psdata)
        HttpHelper.httpPostMessage(cc.UrlTable.url_hb_getmessage,psdata,onPostCallBack,this);
    },


    

     getBaseInfoData(){
         var onPostCallBack = function()
         {
            cc.refreshMoneyShow();
         }
         HttpHelper.httpPostGetBaseInfo(onPostCallBack);
     },
     update (dt) {
        // var t = new Date(new Date().toLocaleDateString());
        //  cc.log(" t=",t);
        if ( cc.UserInfo.limitTimeViedoFlag == true) {
            if ( cc.UserInfo.limitTime > 0) {
                cc.UserInfo.limitTime =  cc.UserInfo.limitTime - dt;
            }else{
                cc.UserInfo.limitTimeViedoFlag = false
            }
        }

        if (this.day != -1 &&this.Flag == false) {
            var myDate = new Date();
            var day = myDate.getDate();
            if (this.day != day) {
                this.getBaseInfoData();
                this.Flag = true;
            }
        }
     },
});
