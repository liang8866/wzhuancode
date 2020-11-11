
cc.Class({
    extends: cc.Component,

    properties: {
        yaoqiuLabeNode: { 
            default: null,
            type: cc.Node
        },
       rewardLabelNode: { 
            default: null,
            type: cc.Node
        },
        letTimeLabelNode: { 
            default: null,
            type: cc.Node
        },
        letTimetitleNode: { 
            default: null,
            type: cc.Node
        },
        boxBtnNode:{
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.35;
            }
            var masklayout = cc.UITools.findNode(this.node,"masklayout");
            if (masklayout != null) {
                masklayout.scale = 1.35;
            }
        }
     },

    start () {
        
        this.leftTimelable = this.letTimeLabelNode.getComponent(cc.Label);
        this.boxBtn = this.boxBtnNode.getComponent(cc.Button);
     // =1 可领取，=0 不显示 如果是时间显示的是剩余时间
        //于1可领取 —> “已完成”，小于当前不显示 —> “没有宝箱”， 
        //  大于当前时间，显示任务倒计时 —> “有宝箱，但未完成”
        if (cc.UserInfo.box_status == 0) {
            this.onGetBoxGift();//领取
            
        }
        else if (cc.UserInfo.box_status == 1) {
            var yaoqiuLabe = this.yaoqiuLabeNode.getComponent(cc.Label);
            yaoqiuLabe.string = "要求：在限时内推荐一位好友(已完成)"
            this.boxBtn.interactable = true;
        // this.bxBtn.interactable = true;
           this.letTimetitleNode.active = false;
        }else if (cc.UserInfo.box_status > 1)
        {
            this.boxBtn.interactable = true;
        }
    },
    onSetParentScript(p)
    {
        this.parentScript = p;
        cc.log(this.parentScript);
    },
    onGetBoxGift(){
       
        if (cc.UserInfo.box_status > 1)
        {
            cc.showCommTip("条件未满足")
            return;
        }


        cc.myShowView(cc.PanelID.LOADING_PAGE,10);  
        var self = this;
        var onPostCallBack  = function(s,ret){
            if (ret == -1) {
                return;
            }   
            if (ret.status == "ok") {//成功
                var data = ret.data;
                cc.log(data)
                if (data.box_status != null) {
                    cc.UserInfo.box_status =data.box_status;
                }
                self.parentScript.onShowBaoXiang();//刷新宝箱
                if (data.reward != null &&data.reward.items!= null ) {
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
                    self.onShowGetReward(reward[0],reward[1]);//显示获得物品
                    cc.onDestoryView(cc.PanelID.MAIN_BOX_PAGE);
                }
                   

                cc.myHideView(cc.PanelID.LOADING_PAGE)   
            }else{
               
                cc.myHideView(cc.PanelID.LOADING_PAGE)
            }
        };
        var psObjdata = {
         
        };
        var psdata = cc.JsonToPostStr(psObjdata);
       
        HttpHelper.httpPost(cc.UrlTable.url_hb_giftbox,psdata,onPostCallBack,this);

    },

    onShowGetReward(itemId,num)
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



    
    onCloseBtn(){//点击关闭
       
        cc.onDestoryView(cc.PanelID.MAIN_BOX_PAGE);
    },
    
    update (dt) {
        if (cc.UserInfo.box_status > 1)
        {
            var lt = cc.getTimeLeft(cc.UserInfo.box_status)
            if (lt>0) {//说明过期了，不显示
            
                this.boxBtn.interactable = true;
                
            }else{//显示倒计时
                this.boxBtn.interactable = true;
                this.leftTimelable.string = cc.formatSeconds(-lt);
            }
        }
        else{
            this.leftTimelable.string ="";
        }
     },
});
