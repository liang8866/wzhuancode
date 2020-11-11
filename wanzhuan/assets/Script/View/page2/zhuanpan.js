

cc.Class({
    extends: cc.Component,

    properties: {
        zp_bg_node:cc.Node,//转盘背景
        maskBtnNode:cc.Node,//遮挡按钮
        closeBtnNode:cc.Node,//遮挡按钮
        comfirmBtnNode:cc.Node,//确认按钮
        layout1Node:cc.Node,
        layout2Node:cc.Node,
        layout3Node:cc.Node,
        layout4Node:cc.Node,
        zhizhenLayout1Node:cc.Node,
        zhizhenLayout2Node:cc.Node,
        zhizhenLayout3Node:cc.Node,
        zhizhenLayout4Node:cc.Node,
        zhizhen1BtnNode:cc.Node,
        zhizhen2BtnNode:cc.Node,
        zhizhen3BtnNode:cc.Node,
        zhizhen4BtnNode:cc.Node,

        chooseLayout:cc.Node,
        dangciIndx:1,//默认档次
        curZhizhenNode:{
            default: null,
            type: cc.Node
        },
      
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
        this.dangciIndx = 3;//默认值

         var self = this;
        // this.zp_bg_node.scale = 0.1;
        // var scaAct = cc.scaleTo(0.3,1.0);
        // var action = cc.sequence(scaAct,cc.callFunc(function(){
            
        //     },this)
        // );
        // this.zp_bg_node.runAction(action);

        this.list = {  
            1:[201,202,151,202,201,203,202,207,201,202],
            2:[202,207,203,201,152,202,207,203],
            3:[201,181,202,182,203,207], 
            4:[203,191,204,182,204,181],  
        }
        


        this.maskBtn = this.maskBtnNode.getComponent(cc.Button);
        this.comfirmBtn = this.comfirmBtnNode.getComponent(cc.Button);
        this.colseBtn = this.closeBtnNode.getComponent(cc.Button);
      
        self.onShowZhuanPanIcon();
        this.onRefreshZhuanPan();
        this.onRefreshUiLabel();
    },

  

    onShowZhuanPanIcon()
    {
        for (const key in this.list) {
            if (this.list.hasOwnProperty(key)) {
                const elementArray = this.list[key];
                var layoutNode = cc.UITools.findNode(this.zp_bg_node,"Layout"+(key));
               
                for (let i= 1; i <= elementArray.length; i++) {
                    var iconNode = cc.UITools.findNode(layoutNode,"icon"+i);
                    var icon = iconNode.getComponent(cc.Sprite);
                    var nameLabel =  cc.UITools.findLabel(iconNode,"nameLabel");
                    var itemid = elementArray[i-1];
                   
                    var itemData = cc.configMgr.getItemDataById(itemid);
                   
                    cc.setItemIcon(itemData.icon,icon);
                    nameLabel.string = itemData.name;
                }
            }
        }
       
    },


    onRefreshUiLabel()//刷新自身卡的数量的
    {
        var list =[150,151,152]
        for (let i = 1; i < 5; i++) {
            var btnNode =  cc.UITools.findNode(this.chooseLayout,"dangci"+  i);  
            var richText = cc.UITools.findRichText(btnNode,"richText"); 
            var id = list[i-1] ;
            if (id != null) {
                var num = cc.UserInfo.getItemNum(id);
                richText.string = "<color=#00ff00>"+ num + "</c><color=#ffffff>/1</color>" ;
            }else {//rmb
                richText.string =  "<color=#00ff00>"+ cc.UserInfo.rmb + "</c><color=#ffffff>/0.2元</color>" ;  ;
            }
        }
    },
    onRefreshZhuanPan()
    {
        this.layout1Node.active = false;
        this.layout2Node.active = false;
        this.layout3Node.active = false;
        this.layout4Node.active = false;
        if (this.dangciIndx == 1) {
            this.layout1Node.active = true;
            this.curZhizhenNode = this.zhizhenLayout1Node;
            
        }
        else if (this.dangciIndx == 2) {
            this.layout2Node.active = true;
            this.curZhizhenNode = this.zhizhenLayout2Node;
        }
        else if (this.dangciIndx == 3) {
            this.layout3Node.active = true;
            this.curZhizhenNode = this.zhizhenLayout3Node;
        }
        else if (this.dangciIndx == 4) {
            this.layout4Node.active = true;
            this.curZhizhenNode = this.zhizhenLayout4Node;
        }


    },

    onChooseDangCi(event, customEventData)
    {
        var curNode = event.target;
        var curButton = curNode.getComponent(cc.Button);
        var curXuanKuang = cc.UITools.findNode(curNode,"xuankuang"); 
        var indx = customEventData;
        for (let i = 1; i < 5; i++) {
            var btnNode =  cc.UITools.findNode(this.chooseLayout,"dangci"+  i);  
            var btn = btnNode.getComponent(cc.Button);
            btn.interactable = true;
            var xuankuangNode = cc.UITools.findNode(btnNode,"xuankuang"); 
            xuankuangNode.active = false;
        }
        curButton.interactable = false;
        curXuanKuang.active = true;
        this.dangciIndx = indx;
        this.onRefreshZhuanPan();
    },


    onZpZhizhenBtn(event, customEventData)
    {
        var node = event.target;
        var button = node.getComponent(cc.Button);
        var indx = customEventData;


    },

    onClickMaskBtn()
    {
        cc.onDestoryView(cc.PanelID.YL_ZHUANPAN);
    },

    onClickComfirmBtn()
    {
        cc.log("================onClickComfirmBtn=")
        this.colseBtn.interactable = false;
        this.comfirmBtn.interactable = false;

        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("转盘====",ret);
                if (ret.status == "ok") {//成功,弹出获得物品
                    
                    var data = ret.data;
                    if (data.cost.items != null) {
                        var costList = data.cost.items;
                        for (let i= 0; i < costList.length; i++) {//消耗
                            cc.UserInfo.reduceItems( costList[i][0], costList[i][1])
                        }
                    }
                    if (data.cost.rmb != null) {
                        cc.UserInfo.rmb = Number.parseFloat(cc.UserInfo.rmb) - Number.parseFloat(data.cost.rmb);
                    }
                    
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
                    
                    var rotateIndex = data.index;
                    self.onRotateZhuanPan(reward[0],reward[1],rotateIndex);
                    cc.refreshMoneyShow();//刷新金钱显示
                    self.onRefreshUiLabel();//刷新自身消耗
                }
                else{
                    cc.showCommTip(ret.msg);
                    self.colseBtn.interactable = true;
                    self.comfirmBtn.interactable = true;
                }
            }
        };
        var psObjdata = {
            type:this.dangciIndx,
            
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_long_zhuanpan,psdata,onPostCallBack,this);

    },

    onRotateZhuanPan(itemId,num,rotateIndex)//传入获得物品的id
    {
        var idx = rotateIndex-1;
        var curlen = this.list[this.dangciIndx +""].length;
        var angle = 360 *6 + idx *(360/curlen) ; //需要转的角度
        cc.log("================xxxxonRotateZhuanPan   x= ",curlen,angle,rotateIndex,this.curZhizhenNode.angle);
        var actRotate = cc.rotateTo(1.2,-angle)//.easing(cc.easeOut(3))this.node.angle
        var delayAct = cc.delayTime(0.3);
        var self = this;
        var action = cc.sequence(actRotate,delayAct,cc.callFunc(function(){
               self.curZhizhenNode.stopAllActions();
                //显示获得物品
                var loadPrefabsCallBack = function()
                {
                  
                    var mperfab = cc.allViewMap[cc.PanelID.YL_POPUPPAGE];
                    var mscript = mperfab.getComponent('popuppage');
                    var itemData = cc.configMgr.getItemDataById(itemId);
                   
                    var ty = cc.itemTypeTransformPopType(itemData.type);
                    //cc.log("ty =1 获得金币   2 金币不足  3解锁龙的  4 回收魔龙的  5获得rmb的  6 获得物品的");
                    //cc.log("itemData.type =",itemData.type,"   ty=",ty);
                    var dd  = itemId;
                    if (ty == cc.popviewType.getgold ) {
                        dd = num;
                    }
                    if (ty == cc.popviewType.getrmb) {
                        dd =  [itemId,num];
                    }
                    mscript.onShowUi(ty,dd,null);
                    self.colseBtn.interactable = true;
                    self.comfirmBtn.interactable = true;
                }
                cc.myShowView(cc.PanelID.YL_POPUPPAGE,7,null,loadPrefabsCallBack); 

            },this)
        );
        this.curZhizhenNode.runAction(action);

    },
    // update (dt) {},
});
