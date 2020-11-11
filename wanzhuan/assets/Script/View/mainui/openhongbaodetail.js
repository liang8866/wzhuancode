

cc.Class({
    extends: cc.Component,

    properties: {
        moneyNode: { //money
            default: null,
            type: cc.Node
        },
        hbid:0,
        maskLayoutNode:cc.Node,
      
        closeBtnNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.35;
            }
        
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*4);
        }
    },

    start () {
        
    
    },
     //点击关闭
     onClickCloseBtn:function(event, customEventData) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
        cc.onDestoryView(cc.PanelID.OPEN_HONGBAO_PAGEDETAIL);
        cc.UserInfo.guideClick = true;//第3步点关闭红包详情
    },
    onSetHongBaoId(id,hbData){
        cc.log("==============hbData=:",hbData);
        this.hbid = id-1;
        this.hbData = hbData;
        cc.UserInfo.serverTime = hbData.server_time;
        cc.UserInfo.box_status = hbData.box_status;
        if ( cc.UserInfo.hb_list[this.hbid].id == hbData.id) {
            cc.UserInfo.hb_list[this.hbid].cold_time = hbData.cold_time;
        }

        var  str = "";
        if (hbData.reward.diamond != null) {
            str = hbData.reward.diamond + "金元";
            cc.UserInfo.diamond  =   Number.parseFloat(cc.UserInfo.diamond)+  Number.parseFloat(hbData.reward.diamond);
        }else if (hbData.reward.gold != null)
        {
            str = hbData.reward.gold + "金币";
            cc.UserInfo.gold  = Number.parseInt(cc.UserInfo.gold) +  Number.parseInt(hbData.reward.gold);
        }
        else if (hbData.reward.rmb != null)
        {
            str = hbData.reward.rmb + "元";
            cc.UserInfo.rmb =  Number.parseFloat(cc.UserInfo.rmb) +  Number.parseFloat(hbData.reward.rmb);
        }
        cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示

        var moneylabel = this.moneyNode.getComponent(cc.Label);
        moneylabel.string = str;
    },
    

    // update (dt) {},
});
