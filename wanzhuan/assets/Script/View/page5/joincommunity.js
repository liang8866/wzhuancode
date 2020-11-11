
cc.Class({
    extends: cc.Component,

    properties: {
        maskLayoutNode:cc.Node,
        topLayoutNode:cc.Node,
      
        downLayoutNode:cc.Node,
      
       
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.25;
            }
            this.topLayoutNode.y = this.topLayoutNode.y +cc.iphone_off_Y*2.0;
            this.downLayoutNode.y = this.downLayoutNode.y +cc.iphone_off_Y*2.0;
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*6);
        }

     },

    start () {
       
       

        if (cc.UserInfo.jionteamData != null) {
            this.onShowLabel(cc.UserInfo.jionteamData);
        }else{
            this.onPostGetjointeamData();
        }
       
      
     
    },
    onPostGetjointeamData()
    {
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
              
                if (ret.status == "ok") {//
                    cc.log("url_person_jointeam====",ret);
                    var data = ret.data;
                    cc.UserInfo.jionteamData = data;
                    self.onShowLabel(data);

                }
                else{
                    //cc.showCommTip(ret.msg);
                }
            }
        };
        var psObjdata = {
           
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_person_jointeam,psdata,onPostCallBack,this);
    },
    onShowLabel(data)
    {
        for (let i = 1; i < 3; i++) {
            var kefuLabelNode = cc.UITools.findNode(this.downLayoutNode,"kefuLabel"+i);
            var kefuLabel = kefuLabelNode.getComponent(cc.Label);
            var wxLabel = cc.UITools.findLabel(kefuLabelNode,"wxlabel");
            kefuLabel.string = data.contact_us[i-1].label;
            wxLabel.string = data.contact_us[i-1].wx;
            
            //var copyBtn = cc.UITools.findLabel(kefuLabelNode,"Label");
            var copyLabel = cc.UITools.findLabel(kefuLabelNode,"Label");
            copyLabel.string = data.contact_us[i-1].wx;
        }

        for (let i = 1; i < 2; i++) {
            var guanfangLabelNode = cc.UITools.findNode(this.downLayoutNode,"guanfangLabel"+i);
            var guanfangLabel = guanfangLabelNode.getComponent(cc.Label);
            var wxLabel = cc.UITools.findLabel(guanfangLabelNode,"wxlabel");
            guanfangLabel.string = data.active[i-1].label;
            wxLabel.string = data.active[i-1].wx;

           
            var copyLabel = cc.UITools.findLabel(guanfangLabelNode,"Label");
            copyLabel.string = data.active[i-1].wx;
        }

        for (let i = 1; i < 3; i++) {
            var jyLabelNode = cc.UITools.findNode(this.downLayoutNode,"jyLabel"+i);
            var jyLabel = jyLabelNode.getComponent(cc.Label);
            var wxLabel = cc.UITools.findLabel(jyLabelNode,"wxlabel");
            jyLabel.string = data.vip[i-1].label;
            wxLabel.string = data.vip[i-1].wx;

            var copyLabel = cc.UITools.findLabel(jyLabelNode,"Label");
            copyLabel.string = data.vip[i-1].wx;
        }

    },
    onClickExit()
    {

        cc.onDestoryView(cc.PanelID.PERSON_jOINCOMMUNITY); 
    },

    onclickCopyString(event, customEventData)
    {
        var node = event.target;
        var button = node.getComponent(cc.Button);
       
        var copyLabel = cc.UITools.findLabel(node,"Label");
        cc.log("=======copystring =",copyLabel.string);
        var str = copyLabel.string;
        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)
        {
            setTimeout(() => {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "JavaCopy", "(Ljava/lang/String;)V", str);
             }, 100)
    
        }else if (cc.sys.os == cc.sys.OS_IOS) {
            
        }
        else{
            this.webCopyString(str)
        }
        cc.showCommTip("已复制到剪贴板");
    },

    webCopyString(str){
        var input = str;
        const el = document.createElement('textarea');
        el.value = input;
        el.setAttribute('readonly', '');
        el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt';
 
        const selection = getSelection();
        var originalRange = false;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }
        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;
 
        var success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {}
 
        document.body.removeChild(el);
 
        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }
 
        return success;               
    },

    // update (dt) {},
});
