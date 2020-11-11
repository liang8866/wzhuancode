

cc.Class({
    extends: cc.Component,

    properties: {
        zhuanpanNode:cc.Node,
        zhizhenNode:cc.Node,
        bigBtnNode:cc.Node,
        startZhuanBtnNode:cc.Node,
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this.zhuanpanNode.scale = 0.1;
        // var act = cc.scaleTo(0.3,1.0);
        // this.zhuanpanNode.runAction(act);
        this.list = 
        {
            2:[162,161,160,181,182],
            3:[152,163,181,182,164]   
        }
        this.bigBtn = this.bigBtnNode.getComponent(cc.Button);
        this.startZhuanBtn = this.startZhuanBtnNode.getComponent(cc.Button);
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
    onSetData(type,targetScript1,targetScript2){
        this.targetScript1 = targetScript1;
        this.targetScript2 = targetScript2;
        this.list = 
        {
            2:[162,161,160,181,182],
            3:[152,163,181,182,164]   
        }
        var guangbglist = {
            4:"gold_guang",
            3:"hongbao_guang",
            2:"item_guang",
        }
        this.showlist = this.list[type];
      
        for (let i = 0; i < this.showlist.length; i++) {
            const id = this.showlist[i];
            var itemData = cc.configMgr.getItemDataById(id);
            var icon = cc.UITools.findSprite(this.zhuanpanNode,"icon"+(i+1));
            var guang = cc.UITools.findSprite(this.zhuanpanNode,"guang"+(i+1));
            cc.setItemIcon(itemData.icon,icon);
            var ty = itemData.type ;
           
            cc.setItemIcon(guangbglist[ty],guang);
            var iconNode = cc.UITools.findNode(this.zhuanpanNode,"icon"+(i+1));
            // var desbgNode = cc.UITools.findNode(icon,"desbg");
            var nameLabel = cc.UITools.findLabel(iconNode,"nameLabel");
            nameLabel.string = itemData.name;
        }
    },
    onClickZhuan()
    {
       
        this.bigBtn.interactable = false;
        this.startZhuanBtn.interactable = false;

        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("特殊龙合体====",ret);
                if (ret.status == "ok") {//成功,弹出获得物品
                    
                    var data = ret.data;
                    var itemsList = data.reward.items;
                    for (let i= 0; i < itemsList.length; i++) {
                        var element = itemsList[i];
                        var itemData = cc.configMgr.getItemDataById(element[0]);
                        // 奖励ID所对应的类型=3，就是红包。
                        // 奖励ID所对应的类型=2，就是道具。
                        // 奖励ID所对应的类型=4，就是金币。
                        if (itemData.type == 3 ) {
                            cc.UserInfo.rmb = Number.parseFloat(cc.UserInfo.rmb) +  Number.parseFloat(element[1]);
                        }else if (itemData.type == 2) {
                            cc.UserInfo.addItems(element[0],element[1]);
                        }
                        else if (itemData.type == 4) {
                            cc.UserInfo.gold = Number(cc.UserInfo.gold) + Number(element[1]);
                        }
                    }
                  
                    self.onRotateZhuanPan(Number(itemsList[0][0]),Number(itemsList[0][1]));//传入获得物品的id
                    cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示
                }
                else{
                    self.bigBtn.interactable = true;
                    self.startZhuanBtn.interactable = true;
                }
            }
        };
        var psObjdata = {
            id1:this.targetScript1.getId(),
            id2:this.targetScript2.getId(),
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_long_merge,psdata,onPostCallBack,this);


    },

    onRotateZhuanPan(itemId,num)//传入获得物品的id
    {
        var idx = -1;
        //查找获得的物品
        for (let index = 0; index < this.showlist.length; index++) {
            var element = this.showlist[index];
            if (Number(itemId) == element) {
                idx = index;
                break;
            }
        }
        if (idx == -1) {
            cc.error("onRotateZhuanPan 查找数据错误")
        }
        var angle = 360 *6 + idx *(360/this.showlist.length); //需要转的角度
        var actRotate = cc.rotateBy(2.0,angle)//.easing(cc.easeOut(3))
        var delayAct = cc.delayTime(0.5);
        cc.log("angle = ",angle);
        var action = cc.sequence(actRotate,delayAct,cc.callFunc(function(){
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

                if (this.targetScript1 != null) {
                    cc.removeLongItemInPage2ById(this.targetScript1.getId());
                }
                if (this.targetScript2 != null) {
                    cc.removeLongItemInPage2ById(this.targetScript2.getId());
                }
                this.bigBtn.interactable = true;
                this.startZhuanBtn.interactable = true;

            },this)
        );
        this.zhizhenNode.runAction(action);

    },

    onClickClose(){
        cc.onDestoryView(cc.PanelID.YL_HETI);
        this.targetScript2.onMoveBack();
        this.targetScript1.onMoveBack();
    },

    // update (dt) {},
});
