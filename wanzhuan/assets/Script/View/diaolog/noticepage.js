
cc.Class({
    extends: cc.Component,

    properties: {
        tipLabelNode1: {
            default: null,
            type: cc.Node
        },
        tipBgNode1:cc.Node,
        tipBgNode2:cc.Node,
        tipBgNode3:cc.Node,
        gongzhonghaoNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
       
    },
    onShowPage(ret)
    {   
        this.ret = ret;
        var data = ret.data;
        if (data.version  != null) {
            this.tipBgNode1.active = false;
            this.tipBgNode2.active = false;
            this.tipBgNode3.active = true;
            this.gongzhonghaoLabel =  this.gongzhonghaoNode.getComponent(cc.Label);
            this.gongzhonghaoLabel.string = "(具体详情前往“"+ data.official+ "”公众号下载)";
            return
        }

        if (data != null) {
            this.tipLabel1 =  this.tipLabelNode1.getComponent(cc.Label);
            if (data.other_login != null && data.other_login == 1) {
                this.tipBgNode1.active = true;
                this.tipBgNode2.active = false;
                this.tipBgNode3.active = false;
                this.tipLabel1.string = ret.msg;
            }
            if (data.needLogin != null && data.needLogin == 1) {
                this.tipBgNode1.active = true;
                this.tipBgNode2.active = false;
                this.tipBgNode3.active = false;
                this.tipLabel1.string = ret.msg;
            }
    
            if (data.out_service != null && data.out_service == 1) {
                this.tipBgNode1.active = false;
                this.tipBgNode2.active = true;
                this.tipBgNode3.active = false;
            }
        }
      
        

    },

    onClickComfirm()
    {
      
       // cc.onDestoryView(cc.PanelID.NOTIC_PAGE)
        //if (cc.sys.os != cc.sys.OS_ANDROID ||cc.sys.os != cc.sys.OS_IOS) {
            cc.UserInfo.token ="";//记录token
            cc.mySetTakenLocal(cc.UserInfo.token );//保存起来
         
        //}
      
        var self = this;
        for (const key in cc.allViewMap) {
            if (cc.allViewMap.hasOwnProperty(key)) {
                const view = cc.allViewMap[key];
              //  cc.log("===========key",key);
                if (key != cc.PanelID.LOADING_PAGE && key != cc.PanelID.WX_LOGINPAGE) {
                    if (view != null&& key != cc.PanelID.NOTIC_PAGE) {
                        //cc.log("===destroy========key",key);
                         view.destroy();
                         cc.allViewMap[key] = null;
                     }
                }
            }
        }
        cc.myHideView(cc.PanelID.LOADING_PAGE);


        if (this.ret.data.version  != null) {//版本的
            var install_url = this.ret.data.install_url;
            cc.sys.openURL(install_url);
            return;
        }

        var loadPrefabsCallBack = function()
        {
           // const view = cc.allViewMap[cc.PanelID.NOTIC_PAGE];
           cc.UserInfo.isShowNoticeFag = false;
            self.node.destroy();
            cc.allViewMap[cc.PanelID.NOTIC_PAGE] = null;
        }
        cc.myShowView(cc.PanelID.WX_LOGINPAGE,-1,null,loadPrefabsCallBack);

      

    },
});
