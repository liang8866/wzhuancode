

cc.Class({
    extends: cc.Component,

    properties: {
        moneyNode: { //money
            default: null,
            type: cc.Node
        },
        maskLayoutNode:cc.Node,
       
        signTipNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.35;
            }
          
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*6);
        }
       


     },

    start () {
     
    },
    //显示签到的提示
    showSginTip(){
        this.signTipNode.active = true;
    },
    onSetGetMoney(reward)
    {
        var moneyLabel = this.moneyNode.getComponent(cc.Label);
        moneyLabel.string = ""+ reward.rmb+"元";
       
    },
     //点击关闭
     onClickCloseBtn:function(event, customEventData) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //cc.onDestoryView(cc.PanelID.OPEN_HONGBAO_PAGEDETAIL);
        //this.node.destroy();
          cc.onDestoryView(cc.PanelID.YL_GETHONGBAODETAIL);
    },
    onClickYaoqing(){
       
    },
    

    // update (dt) {},
});
