

cc.Class({
    extends: cc.Component,

    properties: {
     
        haveNumRichNode:cc.Node,//<color=#ff0000>2张</c><color=#000000>(拥有数量8)</color>
        successLabelNode:cc.Node,
      
        chooseNumNode:cc.Node,
        comfirmBtnNode:cc.Node,
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
       
        this.curNum = 0;
        this.setSuccessRatio();
        this.comfirmBtn = this.comfirmBtnNode.getComponent(cc.Button);
        this.comfirmBtn.interactable = true;
        this.chooseNumLabel = this.chooseNumNode.getComponent(cc.Label);
        this.chooseNumLabel.string = "0";
    },
    setParentScript(ps)
    {
        this.parentScript = ps;
    },
    onShowHaveNum(){
        var allnum = cc.UserInfo.getItemNum(191);
        var haveNumRich = this.haveNumRichNode.getComponent(cc.RichText); 
        haveNumRich.string = "<color=#ff0000>"+ this.curNum  + "张</c><color=#000000>  (拥有数量" +allnum + ")</color>";

    },
    setSuccessRatio()
    {
        var successLabel = this.successLabelNode.getComponent(cc.Label);
        //12.5 = 10%
        var intRatio = this.curNum*20 ;
        successLabel.string = "当前兑换成功率：" +intRatio +"%";
        this.onShowHaveNum();
        this.chooseNumLabel = this.chooseNumNode.getComponent(cc.Label);
        this.chooseNumLabel.string = this.curNum +"";
    },

    
    onClickAdd()
    {
        this.curNum = this.curNum +1;
        if (this.curNum >5) {
            this.curNum = 5;
        }
        this.setSuccessRatio();
    },
    onClickReduce()
    {
        this.curNum = this.curNum - 1;
        if (this.curNum  < 0 ) {
            this.curNum = 0;
        }
        this.setSuccessRatio();

    },

    onClickClose(){
       
        cc.onDestoryView(cc.PanelID.YL_TESU_DUIHUAN);
      
    },
    onClickComfirm(event, customEventData){
    
        var node = event.target;
        var button = node.getComponent(cc.Button);
        button.interactable  = false;
        var allnum = cc.UserInfo.getItemNum(191);
        if (Number(allnum) <= 0 ) {
            cc.showCommTip("友情卡数量不足");
            button.interactable  = true;
        }else if (this.curNum == 0) {
            cc.showCommTip("选择友情卡不能为0");
            button.interactable  = true;
        }
        else if (this.curNum > Number(allnum) ) {
            cc.showCommTip("材料不足");
            button.interactable  = true;
        }
        else{
            var onPostCallBack  = function(self,ret){
                if (ret != -1) {
                    if (ret.status == "ok") {//成功
                        cc.log("兑换 ret=",ret)
                        button.interactable  = true;
                        var data = ret.data
                        var cost = data.cost;
                        if (cost != null) {
                            cc.UserInfo.reduceItems(cost.items[0][0],cost.items[0][1]);
                        }
                       
                        if (Number(data.merge_status) == 1) {
                            
                            var reward = data.reward;
                            if (reward != null) {
                                cc.UserInfo.addItems(reward.items[0][0],reward.items[0][1]);//增加一个
                                 //显示获得物品
                                var loadPrefabsCallBack = function()
                                {
                                    var mperfab = cc.allViewMap[cc.PanelID.YL_POPUPPAGE];
                                    var mscript = mperfab.getComponent('popuppage');
                                    mscript.onShowUi(cc.popviewType.getitems,reward.items[0][0],null);
                                }
                                cc.myShowView(cc.PanelID.YL_POPUPPAGE,10,null,loadPrefabsCallBack); 
                            }
                        }
                        else{
                            cc.showCommTip("兑换失败");
                            button.interactable  = true;
                        }
                        self.onShowHaveNum();
                        self.parentScript.onRefreshShow();//刷新父节点的显示
                    }else{
                        cc.log("兑换失败 ret= ",ret);
                        cc.showCommTip(ret.msg);
                    }
                }

            };
            var psObjdata = {
                num:this.curNum,
            };
            var psdata = cc.JsonToPostStr(psObjdata);
            HttpHelper.httpPost(cc.UrlTable.url_long_exchange_long,psdata,onPostCallBack,this);
        }
    },

    // update (dt) {},
});


