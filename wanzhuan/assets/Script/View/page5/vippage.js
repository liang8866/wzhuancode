

cc.Class({
    extends: cc.Component,

    properties: {
        vipLabelNode:cc.Node,//vip等级
        curGxLabelNode:cc.Node,//当前贡献度
        curdesc1LabelNode:cc.Node,//描述1
        curdesc2LabelNode:cc.Node,//描述2
        lvBarNode:cc.Node,//进度条
        leftGxLabelNode:cc.Node,//剩余多少贡献度可以升级
        topLayoutNode:cc.Node,
        topBgNode:cc.Node,
        maskLayout:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.25;
            }
            this.topLayoutNode.y = this.topLayoutNode.y + cc.iphone_off_Y/2;
            this.topBgNode.setContentSize(this.topBgNode.getContentSize().width,this.topBgNode.getContentSize().height + cc.iphone_off_Y);
            this.topBgNode.y = this.topBgNode.y +cc.iphone_off_Y;
            this.maskLayout.setContentSize(this.maskLayout.getContentSize().width,this.maskLayout.getContentSize().height + cc.iphone_off_Y*2);
        }

     },

    start () {
        this.vipLabel = this.vipLabelNode.getComponent(cc.Label);
        this.vipLabel.string = cc.UserInfo.vip;
        // cc.log(cc.configMgr.configMap[cc.cfg_Name.vip_data]);
        this.vipData = cc.configMgr.configMap[cc.cfg_Name.vip_data];
        var curdesc1Label = this.curdesc1LabelNode.getComponent(cc.Label);
        curdesc1Label.string= this.vipData[Number(cc.UserInfo.vip)].desc1;
        var curdesc2Label = this.curdesc2LabelNode.getComponent(cc.Label);
        curdesc2Label.string= this.vipData[Number(cc.UserInfo.vip)].desc2;
        
    },
   onClickCloseBtn()
   {
        cc.onDestoryView(cc.PanelID.PERSON_VIP);
   },
    // update (dt) {},
});
