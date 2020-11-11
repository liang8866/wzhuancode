
cc.Class({
    extends: cc.Component,

    properties: {
        webview: cc.WebView,
        maskLayoutNode:cc.Node,
        topLayoutNode:cc.Node,
        titleLabelNode:cc.Node,
        yonghuNode:cc.Node,
        yinsiNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    
     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.35;
            }
            this.topLayoutNode.y = this.topLayoutNode.y +cc.iphone_off_Y*1.5
           // this.webview.y = this.webview.y - cc.iphone_off_Y*5;
            this.webview.node.setContentSize(this.webview.node.getContentSize().width,this.webview.node.getContentSize().height + cc.iphone_off_Y*2);
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*6);
        }
        
     },

    start () {
        this.titleLabel = this.titleLabelNode.getComponent(cc.Label);
        this.titleLabel.string = "";
    },
    setWebTitle(str)
    {
       
        cc.log("=============str=",str)
        if (str == "用户协议") {
            this.yonghuNode.active = true;
        }
        else if (str == "隐私协议") {
            this.yinsiNode.active = true;
        }
        else{
            this.titleLabel = this.titleLabelNode.getComponent(cc.Label);
            this.titleLabel.string = str;
        }

    },
    onShowWeb(url)
    {
        this.webview.url = url;
       // this.webview.url = "https://forum.cocos.org/t/cocos-creator-webview-jscallback/49264/5";
    },

    onClickBack()
    {
        cc.onDestoryView(cc.PanelID.COM_SHOW_WEB);
    },
    onWebFinishLoad: function (sender, event) {
        var loadStatus = "";
        if (event === cc.WebView.EventType.LOADED) {
            loadStatus = " is loaded!";
        } else if (event === cc.WebView.EventType.LOADING) {
            loadStatus = " is loading!";
        } else if (event === cc.WebView.EventType.ERROR) {
            loadStatus = ' load error!';
        }
        cc.log("loadStatus =",loadStatus);
    },
    // update (dt) {},
});
