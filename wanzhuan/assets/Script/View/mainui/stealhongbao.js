// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       
        moenyTypeLabelNode: { 
            default: null,
            type: cc.Node
        },
        numMonyLabelNode: { 
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
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

    start () {
       
        // this.moenyTypeLabel =  this.moenyTypeLabelNode.getComponent(cc.Label);
        // this.numMonyLabel =  this.numMonyLabelNode.getComponent(cc.Label);
    },
    
    onShowUi(ret){//请求回来得到的数据
        this.moenyTypeLabel =  this.moenyTypeLabelNode.getComponent(cc.Label);
        this.numMonyLabel =  this.numMonyLabelNode.getComponent(cc.Label);
        var  str1 = "";
        var  str2 = "";
        if (ret.reward.diamond != null) {
            str1 = ret.reward.diamond ;
            cc.UserInfo.diamond  = Number.parseFloat(cc.UserInfo.diamond ) + Number.parseFloat(ret.reward.diamond);
            str2 = "金元";
        }else if (ret.reward.gold != null)
        {
            str1 = ret.reward.gold ;
            cc.UserInfo.gold = Number.parseInt(cc.UserInfo.gold) + Number.parseInt(ret.reward.gold);
            str2 = "金币";
        }
        else if (ret.reward.rmb != null)
        {
            str1 = ret.reward.rmb ;
            cc.UserInfo.rmb = Number.parseFloat(cc.UserInfo.rmb) +  Number.parseFloat(ret.reward.rmb);
            str2 = "人民币";
        }
        this.numMonyLabel.string = str1+ str2;
       // this.moenyTypeLabel.string = str2;
        cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示
    },

    onClickComfirm(){
     
        var view = cc.allViewMap[cc.PanelID.STAELHONGBAO];
        if (view == null) {
            this.node.destroy();
        }
        else{
            cc.onDestoryView(cc.PanelID.STAELHONGBAO);
        }
    },
    // update (dt) {},
});
