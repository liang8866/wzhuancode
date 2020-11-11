

cc.Class({
    extends: cc.Component,

    properties: {
      
        bgNode:cc.Node,
        showTipNode:cc.Node,
        wetchatBtnNode:cc.Node,
        pwBtnNode:cc.Node,
        yonghuxieyiButtonNode:cc.Node,
        yinsiButtonNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
      
        
        this.wetchatBtn = this.wetchatBtnNode.getComponent(cc.Button);
        this.pwBtn = this.pwBtnNode.getComponent(cc.Button);
        this.yonghuxieyiButton = this.yonghuxieyiButtonNode.getComponent(cc.Button);
        this.yinsiButton = this.yinsiButtonNode.getComponent(cc.Button);
        this.wetchatBtn.interactable = false;
        this.pwBtn.interactable = false;
        this.yonghuxieyiButton.interactable = false;
        this.yinsiButton.interactable = false;
         var self = this;
        var delayCallBack = function()
        {
            self.wetchatBtn.interactable = true;
            self.pwBtn.interactable = true;
            self.yonghuxieyiButton.interactable = true;
            self.yinsiButton.interactable = true;
        }
        cc.PerDelayDo(this.node,delayCallBack,0.5,null);


        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.35;
            }
            this.bgNode.scale = 1.35;
          
        }
     
        this.clickFlag = false;

    },
   

    //点击吊起微信登陆的
    onClickWxBtn:function(event, customEventData) {
        var nowVersion = Number.parseFloat(cc.UserInfo.nowVersion);
        var lineversion =Number.parseFloat(cc.UserInfo.onlineVersion);

        if (lineversion > nowVersion) {
            var loadPrefabsCallBack = function(perfab)
            {
                var script = perfab.getComponent('noticepage');
                script.onShowPage(cc.UserInfo.versiondata);
            }
            cc.myShowView(cc.PanelID.NOTIC_PAGE,20,null,loadPrefabsCallBack);  
            return;
        }
        var node = event.target;
        var button = node.getComponent(cc.Button);
       // button.interactable = false;
        // this.node.active = false;//隐藏掉
        // cc.myHideView(cc.PanelID.WX_LOGINPAGE);
        // cc.myShowView(cc.PanelID.MAIN_PAGE,1);
       
        if (cc.sys.os == cc.sys.OS_ANDROID) {
           
            // jsb.reflection.callStaticMethod(this.getSDKAPI(), 'Login', '()V');
            jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'Login', '()V')
         
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.getSDKAPI(), 'login');
        }

    },

    //密码登陆的
    onClickPwBtn:function(event, customEventData) {
        var nowVersion = Number.parseFloat(cc.UserInfo.nowVersion);
        var lineversion =Number.parseFloat(cc.UserInfo.onlineVersion);

        if (lineversion > nowVersion) {
            var loadPrefabsCallBack = function(perfab)
            {
                var script = perfab.getComponent('noticepage');
                script.onShowPage(cc.UserInfo.versiondata);
            }
            cc.myShowView(cc.PanelID.NOTIC_PAGE,20,null,loadPrefabsCallBack);  
            return;
        }
        var node = event.target;
        var button = node.getComponent(cc.Button);
        // this.node.active = false;//隐藏掉
        var self = this;
       
        var perfabsCallBack = function()
        {
           // var perfab = cc.allViewMap[cc.PanelID.PW_LOGIN];
            cc.onDestoryView(cc.PanelID.WX_LOGINPAGE);
        };
        cc.myShowView(cc.PanelID.PW_LOGIN,1,null,perfabsCallBack);//进来默认是显示微信登陆

    },
    getSDKAPI: function () {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
                   
            return  'com/tianzheng/daydaymoney/WXAPI';
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            return 'WxHelper';
        }
    },

   
    onPostLogin(token)
    {
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("登录请求返回",ret);
                if (ret.status == "ok") {//成功
                    cc.log("成功登录:",ret.data.token);
                    if (Number(ret.data.need_bind) == 1) {//需要去注册

                        var loadPrefabsCallBack = function()
                        {
                            cc.onDestoryView(cc.PanelID.WX_LOGINPAGE);
                            cc.myHideView(cc.PanelID.LOADING_PAGE)
                        }

                        cc.myShowView(cc.PanelID.REGISTER,2,null,loadPrefabsCallBack);  
                        cc.UserInfo.isWxLogin = true;
                        cc.UserInfo.token = ret.data.token;//记录token
                       
                    }else
                    {
                        cc.UserInfo.isWxLogin = true;
                        cc.UserInfo.token = ret.data.token;//记录token
                        cc.mySetTakenLocal( cc.UserInfo.token );//保存起来
                        self.showOnLoadingBaseInfo();//获取基本信息

                    }
                   
                }else{
                    cc.showCommTip(ret.msg);//显示错误类型
                    cc.myHideView(cc.PanelID.LOADING_PAGE)
                }
            }
        };

        //请求登陆信息的
        var psObjdata = {
            code:token,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_login_wx,psdata,onPostCallBack,this);

        cc.myShowView(cc.PanelID.LOADING_PAGE,15); 

    },

    showOnLoadingBaseInfo:function() {
        
        var self = this;
        var onPostCallBack  = function(s,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                    self.onShowMainPage();
                }else{
                   
                }
            }
        }
        HttpHelper.httpPostGetBaseInfo(onPostCallBack);
        cc.myShowView(cc.PanelID.LOADING_PAGE,15); 
    },

    onShowMainPage(){
        //延迟下显示
        var self = this;
        var delayCallBack = function()
        {
            cc.log("=====wx=========loading ok begin ")
             cc.myHideView(cc.PanelID.LOADING_PAGE);
             cc.onDestoryView(cc.PanelID.WX_LOGINPAGE);
             
            self.isFlag = true;
        }
        self.isFlag = false
        self.count = 0;
        var callback = function()
        {
            cc.log("======wx========add main page begin ")
            //cc.PerDelayDo(self.node,delayCallBack,2.5,null);
            cc.myShowView(cc.PanelID.MAIN_PAGE,-1,null,delayCallBack);
           
        }
        cc.log("========wx======load  prefab  begin ")
        cc.onLoadAllPrefab(callback);
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

     update (dt) {
        this.count = this.count +dt;
        if (this.isFlag == true &&  this.count  >=0.2) {
            this.isFlag  = false
            cc.myHideView(cc.PanelID.LOADING_PAGE);
            cc.onDestoryView(cc.PanelID.WX_LOGINPAGE);
        }
     },
});


