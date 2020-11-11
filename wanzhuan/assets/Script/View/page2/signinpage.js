
cc.Class({
    extends: cc.Component,

    properties: {
        
        signinConetenNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
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
        this.onRefreshShow();
    },
    
    
    onRefreshShow(){
        for (let index = 1; index <= 7; index++) {
            var maskSignNode =  cc.UITools.findNode(this.signinConetenNode,"signin_ok"+index);
            if (index <= Number.parseInt(cc.UserInfo.signin)) {
                maskSignNode.active = true;
            }
            else{
                maskSignNode.active = false;
            }
        }

    },
    onShowHongBao(reward)//显示红包
    {
        cc.UserInfo.rmb = Number.parseFloat(cc.UserInfo.rmb) + Number.parseFloat(reward.rmb);
        cc.refreshMoneyShow();
        var self = this;
        var loadPrefabsCallBack = function()
        {
          
            var perfab = cc.allViewMap[cc.PanelID.YL_GETHONGBAODETAIL];
            var script = perfab.getComponent('gethongbaodetail');
            script.onSetGetMoney(reward);
            script.showSginTip();//显示签到的提示
            self.onClickClose();
        }

        cc.myShowView(cc.PanelID.YL_GETHONGBAODETAIL,10,null,loadPrefabsCallBack);  

    },
    onClickComfirm(event, customEventData)
    {
        var node = event.target;
        var button = node.getComponent(cc.Button);

        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                    var data = ret.data
                    cc.log("签到成功 ret= ",ret);
                    cc.UserInfo.signin = Number.parseInt(data.signin);
                    cc.UserInfo.signin_time = Number.parseInt(data.signin_time);
                
                    
                    var fsscript = cc.getPageSriptByIndx(1);
                    if (fsscript != null) {
                        fsscript.onSetSignMiss();//刷新显示
                    }
                    self.onRefreshShow();
                    self.onGetRewardDeal(data);
                }else{
                    cc.log("签到失败 ret= ",ret);
                    cc.showCommTip(ret.msg);
                }
            }
        };
        var psObjdata = {
           
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_long_signin,psdata,onPostCallBack,this);

    },

    onGetRewardDeal(data)
    {
        

        if (data.reward == null) {
            return;
        }
        if (data.reward.rmb != null) {
            
            this.onShowHongBao(data.reward);
          
            return;
        }
        var itemsList = data.reward.items;
        if (itemsList == null) {
            return;
        }
        for (let i= 0; i < itemsList.length; i++) {
            var element = itemsList[i];
            var itemData = cc.configMgr.getItemDataById(element[0]);
            // 奖励ID所对应的类型=3，就是红包。
            // 奖励ID所对应的类型=2，就是道具。
            // 奖励ID所对应的类型=4，就是金币。
            if (itemData.type == 3 ) {
                cc.UserInfo.rmb = Number.parseFloat(cc.UserInfo.rmb) + Number.parseFloat(element[1]);
                var reward = {rmb:Number.parseFloat(element[1])};
                
                this.onShowHongBao(reward);
                
            }else if (itemData.type == 2) {
                cc.UserInfo.addItems(element[0],element[1]);
                this.onShowPopView(element[0],element[1]);
            }
            else if (itemData.type == 4) {
                cc.UserInfo.gold = Number.parseInt(cc.UserInfo.gold) + Number.parseInt(element[1]);
                this.onShowPopView(element[0],element[1]);
            }
        }
        cc.refreshMoneyShow();
       
        this.onClickClose();
      
    },

    onShowPopView(itemId,num)
    {
            //显示获得物品
            var loadPrefabsCallBack = function()
            {
                cc.onDestoryView(cc.PanelID.YL_HETI);
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
            cc.myShowView(cc.PanelID.YL_POPUPPAGE,8,null,loadPrefabsCallBack); 
    },

    onClickClose()
    {
        cc.onDestoryView(cc.PanelID.YL_SIGNSIN);

    },
     update (dt) {
        
        //cc.log("===  this.aniNode.rotation=",this.aniNode.angle);

     },
});
