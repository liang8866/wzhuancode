

cc.Class({
    extends: cc.Component,

    properties: {
      
        flagOpen:false,
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

    },
    onshowHbUi(reward)
    {
        this.reward = reward;
        this.flagOpen = false;
    },
    
    
    onClickGetComfirmBtn()//点击获得金币按钮的确认
    {
        var self = this;
        if (this.flagOpen) {
            return;
        }
        this.flagOpen = true;

        var loadPrefabsCallBack = function()
        {
            // self.node.destroy();
            cc.onDestoryView(cc.PanelID.YL_GETHONGBAO);
            var perfab = cc.allViewMap[cc.PanelID.YL_GETHONGBAODETAIL];
            var script = perfab.getComponent('gethongbaodetail');
            script.onSetGetMoney(self.reward);
        }

        cc.myShowView(cc.PanelID.YL_GETHONGBAODETAIL,10,null,loadPrefabsCallBack);  

    },

    
    // update (dt) {},
});
