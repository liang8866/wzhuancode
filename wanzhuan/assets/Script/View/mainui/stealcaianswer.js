
cc.Class({
    extends: cc.Component,

    properties: {
        moenyTypeLabelNode: { //金元的
            default: null,
            type: cc.Node
        },
        numMonyLabelNode: { //金元的
            default: null,
            type: cc.Node
        },
        moenyTypeLabelNode2: { //RMB
            default: null,
            type: cc.Node
        },
        numMonyLabelNode2: { //RMB
            default: null,
            type: cc.Node
        },
        rmb_icon:{
            default: null,
            type: cc.Node
        },
        jinyuan_icon:{
            default: null,
            type: cc.Node
        },

        caizhongpage:{
            default: null,
            type: cc.Node
        },
        meizhongpage:{
            default: null,
            type: cc.Node
        },
        maskLayoutNode:cc.Node,
       
        btnLabelNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.35;
            }
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*8);
        }

     },

    start () {
       
    },
    onClickComfirm(vent, customEventData){//点击那个确认的
        cc.onDestoryView(cc.PanelID.STEALCAI_ANSWER);
    },
    
    initShowUi(ret){
        this.moenyTypeLabel =  this.moenyTypeLabelNode.getComponent(cc.Label);
        this.numMonyLabel =  this.numMonyLabelNode.getComponent(cc.Label);
        this.moenyTypeLabel2 =  this.moenyTypeLabelNode2.getComponent(cc.Label);
        this.numMonyLabel2 =  this.numMonyLabelNode2.getComponent(cc.Label);
        var data = ret.data
        cc.log("猜-猜   answer ",ret)
        if (data.guess == 0) {
            this.meizhongpage.active = false;
            this.caizhongpage.active = true;
            var  str1 = "";
            var  str2 = "";
            if (data.reward.diamond != null) {
                str1 = Number(data.reward.diamond).toFixed(2) ;
                
                cc.UserInfo.diamond =  Number.parseFloat(cc.UserInfo.diamond) +   Number.parseFloat(data.reward.diamond);
              
                str2 = "金元";
                this.jinyuan_icon.active = true;
                this.rmb_icon.active = false;
                this.numMonyLabel.string = str1;
                this.moenyTypeLabel.string = str2;

                this.moenyTypeLabelNode.active = true;
                this.moenyTypeLabelNode2.active = false;
                var btnLabel = this.btnLabelNode.getComponent(cc.Label);
                btnLabel.string = "确定"
            }else if (data.reward.gold != null)
            {
                str1 =  Number(data.reward.gold).toFixed(2) ;
                cc.UserInfo.gold = Number.parseInt(cc.UserInfo.gold) +  Number.parseInt(data.reward.gold);
                str2 = "金币";
            }
            else if (data.reward.rmb != null)
            {
               
                str1 =  Number(data.reward.rmb).toFixed(2) ; 
                this.numMonyLabel2.string = str1 + "元";
                cc.UserInfo.rmb =   Number.parseFloat(cc.UserInfo.rmb) +  Number.parseFloat(data.reward.rmb);
                //cc.log("======diamond===",cc.UserInfo.rmb,typeof(cc.UserInfo.rmb))
                this.jinyuan_icon.active = false;
                this.rmb_icon.active = true;

                this.moenyTypeLabelNode.active = false;
                this.moenyTypeLabelNode2.active = true;
                var btnLabel = this.btnLabelNode.getComponent(cc.Label);
                btnLabel.string = "放入钱包"
            }else{
                this.meizhongpage.active = true;
                this.caizhongpage.active = false;
            }
            cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示
        }
        else{
            this.meizhongpage.active = true;
            this.caizhongpage.active = false;
        }

    },

    // update (dt) {},
});
