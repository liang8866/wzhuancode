
cc.Class({
    extends: cc.Component,

    properties: {
       udidLabelNode:cc.Node,
       wetchatNameLableNode:cc.Node,
       phoneNumLableNode:cc.Node,
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
        var udidLabel = this.udidLabelNode.getComponent(cc.Label);
        var wetchatNameLable = this.wetchatNameLableNode.getComponent(cc.Label);
        var phoneNumLable = this.phoneNumLableNode.getComponent(cc.Label);
        udidLabel.string = cc.UserInfo.id;
        wetchatNameLable.string = cc.UserInfo.nickname;
        var mobileStr = cc.UserInfo.mobile +"";
        if (mobileStr != null || mobileStr != "") {
            mobileStr = mobileStr.substring(0,3)+ "****" + mobileStr.substring(7);
        }
        phoneNumLable.string = mobileStr;
      

    },
    onClickResetPW()
    {
        var loadPrefabsCallBack = function()
        {
            var perfab = cc.allViewMap[cc.PanelID.RESET_PW];
            var script = perfab.getComponent('resetpw');
           
            script.setComeFromType(1);
        }
        cc.myShowView(cc.PanelID.RESET_PW,8,null,loadPrefabsCallBack);

    },
    onClickBack(){
        cc.onDestoryView(cc.PanelID.PERSON_SETTING);

    },
    onClcikExit()
    {
        cc.myShowView(cc.PanelID.LOADING_PAGE,10);
    
        //请求龙的数据列表
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("url_login_out ret:",ret)
                if (ret.status == "ok") {//成功
                    
                    self.onShowLogin();
                   
                }else
                {
                    cc.showCommTip(ret.msg);
                    cc.myHideView(cc.PanelID.LOADING_PAGE);
                }
            }
        };
        var psObjdata = {
          
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_login_out,psdata,onPostCallBack,this);

    },
    onShowLogin()
    {
        //if (cc.sys.os != cc.sys.OS_ANDROID ||cc.sys.os != cc.sys.OS_IOS) {
            cc.UserInfo.token ="";//记录token
            cc.mySetTakenLocal(cc.UserInfo.token );//保存起来
         
        //}
      
        var self = this;
       // cc.log( cc.allViewMap)
        for (const key in cc.allViewMap) {
            if (cc.allViewMap.hasOwnProperty(key)) {
                const view = cc.allViewMap[key];
                if (key != cc.PanelID.LOADING_PAGE && key != cc.PanelID.PERSON_SETTING) {
                    if (view != null) {
                        cc.log("= ",key,view)
                        view.destroy();
                        cc.allViewMap[key] = null;
                    }
                }
 
            }
        }
        cc.myHideView(cc.PanelID.LOADING_PAGE);
        var loadPrefabsCallBack = function()
        {
            cc.UserInfo.clearData();
            cc.showCommTip("退出成功");
            // cc.onDestoryView(cc.PanelID.PERSON_SETTING);
            const view = cc.allViewMap[cc.PanelID.PERSON_SETTING];
            view.destroy();
            cc.allViewMap[cc.PanelID.PERSON_SETTING] = null;
        }
        cc.myShowView(cc.PanelID.WX_LOGINPAGE,-1,null,loadPrefabsCallBack);

    },
    
    onClickFuWuBtn()
    {   
        if (this.clickFlag) {
            
            return;
        }
        this.clickFlag = true;
        var self = this;
        var loadPrefabsCallBack = function(prefab)
      {
          self.clickFlag = false;
          var script = prefab.getComponent('showWebPage');
          var url = "http://dragon.wanlege.com/qrcode/protocol.html";
          script.onShowWeb(url);
          script.setWebTitle("用户协议");
      }
      cc.myShowView(cc.PanelID.COM_SHOW_WEB,7,null,loadPrefabsCallBack);

    },

    onClickYinSiBtn()
    {
          
        if (this.clickFlag) {
            
            return;
        }
        this.clickFlag = true;
        var self = this;
        var loadPrefabsCallBack = function(prefab)
      {
          self.clickFlag = false;
          var script = prefab.getComponent('showWebPage');
          var url = "http://dragon.wanlege.com/qrcode/privary.html";
          script.onShowWeb(url);
          script.setWebTitle("隐私协议");
      }
      cc.myShowView(cc.PanelID.COM_SHOW_WEB,7,null,loadPrefabsCallBack);
    },



    // update (dt) {},
});
