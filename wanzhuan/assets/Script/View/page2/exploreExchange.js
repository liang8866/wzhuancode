

cc.Class({
    extends: cc.Component,

    properties: {
        bgNode: {//
            default: null,
            type: cc.Node
        },
        itemIconNode:cc.Node,//
        itemNameNode:cc.Node,
        desRichNode:cc.Node,
        goldNumLabelNode:cc.Node,
        numItemLableNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.bgNode.scale = 0.1;
        var act = cc.scaleTo(0.3,1.0);
        this.bgNode.runAction(act);
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
    onShowUi(itemid,gold,parentScript)//显示
    {   
        this.parentScript = parentScript;
        var itemIcon = this.itemIconNode.getComponent(cc.Sprite);
        var itemNameLabel = this.itemNameNode.getComponent(cc.Label);
        var desRichtext = this.desRichNode.getComponent(cc.RichText);
        var goldNumLabel = this.goldNumLabelNode.getComponent(cc.Label);

        var itemdata = cc.configMgr.getItemDataById(itemid);
        cc.setItemIcon(itemdata.icon,itemIcon);
        itemNameLabel.string = itemdata.name;
        goldNumLabel.string = gold +"金币";
        desRichtext.string = this.getRichString(itemdata.name);


        var numItemLable = this.numItemLableNode.getComponent(cc.Label);
        var num = cc.UserInfo.getItemNum(itemid);
        numItemLable.string = "当前拥有：" + num;

    },
  
    onClickClose()//关闭或者取消
    {
        cc.onDestoryView(cc.PanelID.YL_EXPLOREEXCHANGE);
    },
    onClickChange()//点击兑换
    {   
        var self = this;
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                    var data = ret.data
                    cc.log("兑换成功 ret= ",ret);
                 
                    cc.UserInfo.gold = Number( cc.UserInfo.gold) + Number(data.reward.gold);//金币增加
                  
                    //减少消耗的物品
                    var itemsList = data.cost.items;
                    for (let i= 0; i < itemsList.length; i++) {
                        var element = itemsList[i];
                       cc.UserInfo.reduceItems(element[0],element[1]);
                    }

                    cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示
                    self.onshowgetGoldView(data.reward.gold);

                }else{
                    cc.log("兑换失败 ret= ",ret);
                    cc.showCommTip(ret.msg);
                    
                    cc.onDestoryView(cc.PanelID.YL_EXPLOREEXCHANGE);
                }
            }
        };
        var psObjdata = {
           
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_long_explore_exchange_gold,psdata,onPostCallBack,this);


    },

    getRichString(itemname){//获得金币的rich
        var str = "<color=#000000>是否同意将</color><color=#FF0000>" + itemname + "</color><color=#000000>转换成</color><color=#FF0000>金币</color>"  ;
        return str;
    } , 

    onshowgetGoldView(goldnum)
    {
         //显示获得物品
         var loadPrefabsCallBack = function()
         {
             cc.onDestoryView(cc.PanelID.YL_EXPLOREEXCHANGE);
             var mperfab = cc.allViewMap[cc.PanelID.YL_POPUPPAGE];
             var mscript = mperfab.getComponent('popuppage');
             mscript.onShowUi(cc.popviewType.getgold,goldnum,null);
           
         }
         cc.myShowView(cc.PanelID.YL_POPUPPAGE,7,null,loadPrefabsCallBack); 

    }
    
    // update (dt) {},
});
