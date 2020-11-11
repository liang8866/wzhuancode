

cc.Class({
    extends: cc.Component,

    properties: {
      
        hbIdx:0,
        flagOpen:false,
    },
    
    start () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.25;
            }
            var masklayout = cc.UITools.findNode(this.node,"masklayout");
            if (masklayout != null) {
                masklayout.scale = 1.25;
            }
        }
    },

 //点击关闭
 onClickCloseBtn(event, customEventData) {
         
    var node = event.target;
    var button = node.getComponent(cc.Button);
  
    cc.onDestoryView(cc.PanelID.OPEN_HONGBAO_PAGE);
},

onClickOpen1(){//点击打开
       
   this.showAndoridVideo();
    
    
},
showAndoridVideo(){
    cc.UserInfo.showVideoPage = this;

    this.showRewardVideo("4");//显示激励视频
},


//请求打开视频
showRewardVideo(s)//1,2,3是显示腾讯视频
{
  if (cc.sys.os == cc.sys.OS_ANDROID) {

      jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showRewardVideo', '(Ljava/lang/String;)V',s);
      cc.UserInfo.limitTimeViedoFlag =  true;
      cc.UserInfo.limitTime = 1.0;
  }
  else if (cc.sys.os == cc.sys.OS_IOS) {

  }
  else{
    if (cc.UserInfo.showVideoPage) {
        cc.UserInfo.showVideoPage.onFinishGetReward();
        cc.UserInfo.showVideoPage = null;
        cc.UserInfo.limitTimeViedoFlag =  true;
        cc.UserInfo.limitTime = 15;
       
      }
  }

},


    setHongBaoShow(id)
    {
        this.hbIdx = id;
        this.flagOpen = false;
        cc.log("第几个红包：",this.hbIdx,cc.UserInfo.hb_list[this.hbIdx-1].id);
       
    },

    onPostGetReward()
    {
        var hongbaoIdx = this.hbIdx;
        var self = this;
        if (this.flagOpen) {
            return;
        }
        this.flagOpen = true;
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                cc.log("=======福树红包的=========",ret)
                   self.showPopUpRewardUi(ret.data)

                }
            }
        };
        // cc.log("----------",this.hbIdx,hongbaoIdx);
        //请求登陆信息的
        var psObjdata = {
            id:cc.UserInfo.hb_list[hongbaoIdx-1].id,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_hb_open,psdata,onPostCallBack,this);

        cc.UserInfo.guideClick = true;//第2步点打开红包

    },

    onFinishGetReward(){
      this.onPostGetReward();//请求获得奖励
    },

    showPopUpRewardUi(data)
    {
       
        var self = this;
        if (data.reward.items) {//获得分红卡的
           
            var itemsList = data.reward.items;
            for (let i= 0; i < itemsList.length; i++) {
                var element = itemsList[i];
                var itemData = cc.configMgr.getItemDataById(element[0]);
                // 奖励ID所对应的类型=3，就是红包。
                // 奖励ID所对应的类型=2，就是道具。
                // 奖励ID所对应的类型=4，就是金币。
                if (itemData.type == 3 ) {
                    cc.UserInfo.rmb = Number.parseFloat(cc.UserInfo.rmb) + Number.parseFloat(element[1]);
                }else if (itemData.type == 2) {
                    cc.UserInfo.addItems(element[0],element[1]);
                }
                else if (itemData.type == 4) {
                    cc.UserInfo.gold = Number.parseInt(cc.UserInfo.gold) + Number.parseInt(element[1]);
                }
            }
            var reward = itemsList[0];   
            this.onShowItemReward(reward[0],reward[1]);//显示获得物品
        }
        else if(data.reward.rmb)//获得现金的
        {
            var showCallBack = function(){
                var opPerfab = cc.allViewMap[cc.PanelID.OPEN_HONGBAO_PAGEDETAIL];
                var opScript = opPerfab.getComponent('openhongbaodetail');
                opScript.onSetHongBaoId(self.hbIdx,data);
            }  
            cc.myShowView(cc.PanelID.OPEN_HONGBAO_PAGEDETAIL,10,null,showCallBack);
            cc.onDestoryView(cc.PanelID.OPEN_HONGBAO_PAGE);
        }

        cc.onDestoryView(cc.PanelID.OPEN_HONGBAO_PAGE);
    },

    onShowItemReward(itemId,num)
    {
      
          //显示获得物品
          var loadPrefabsCallBack = function()
          {
              cc.onDestoryView(cc.PanelID.MAIN_BOX_PAGE);
              var mperfab = cc.allViewMap[cc.PanelID.YL_POPUPPAGE];
              var mscript = mperfab.getComponent('popuppage');
              var itemData = cc.configMgr.getItemDataById(itemId);
              var ty = cc.itemTypeTransformPopType(itemData.type);
              var dd  = itemId;
              if (ty == cc.popviewType.getgold ) {
                  dd = num;
              }
              if (ty == cc.popviewType.getrmb) {
                dd = [itemId,num];
            }
              mscript.onShowUi(ty,dd,null);
              
          }
          cc.myShowView(cc.PanelID.YL_POPUPPAGE,7,null,loadPrefabsCallBack); 
    },

    // update (dt) {},
});
