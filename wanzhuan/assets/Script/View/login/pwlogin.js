// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
   
        maskLayoutNode:cc.Node,
        topLayoyNode:cc.Node,
      
        psErr:false,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.35;
            }
            this.topLayoyNode.y = this.topLayoyNode.y + cc.iphone_off_Y*1.5;
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*6);
          
        }
     },

    start () {
        this.phoneNum = "";
        this.pw = "";
        this.isShowFlag = false;
        
    
        

       
    },
    //点击返回按钮
    onClickBackBtn:function(event, customEventData) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //this.node.active = false;//隐藏掉
      
        var loadPrefabsCallBack = function()
        {
            cc.onDestoryView(cc.PanelID.PW_LOGIN); 
        }

        cc.myShowView(cc.PanelID.WX_LOGINPAGE,2,null,loadPrefabsCallBack);
            
    },
    //点击忘记密码
    onClickForgetBtn:function(event, customEventData) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
    
        var loadPrefabsCallBack = function()
        {
            cc.onDestoryView(cc.PanelID.PW_LOGIN); 
        }

        cc.myShowView(cc.PanelID.RESET_PW,2,null,loadPrefabsCallBack);
            
    },
    //点击确认按钮
    onClickComfirtmBtn:function(event, customEventData) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
        if (this.isShowFlag == true) {
            return;
        }

        //this.node.active = false;//隐藏掉
        var isPhone =   cc.isPoneAvailable(this.phoneNum);
        if (isPhone == false) {
            
            cc.showCommTip("请输入正确手机号码");
            return;
        }
       
        var isPw =   cc.isPasswd(this.pw);
        if (isPw == false) {
            cc.showCommTip("密码错误")
           
            return;
        }

        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                    cc.log("成功登录:",ret.data.token);
                    cc.UserInfo.token = ret.data.token;//记录token
                    cc.mySetTakenLocal( cc.UserInfo.token );//保存起来

                    self.showOnLoadingBaseInfo();//获取基本信息
                }else{
                    cc.showCommTip(ret.msg);//显示错误类型
                    cc.log("ret = ",ret);
                     cc.log(cc.allViewMap[cc.PanelID.LOADING_PAGE])
                     var loadpage = cc.UITools.findNode(cc.rootpanel,"loadpage")
                     cc.log(loadpage)
                     cc.log(cc.rootpanel)
                     self.psErr = true;
                    // for (var i = 0; i < cc.rootpanel.children.length; i++) {
                    //     var node = cc.rootpane._children[i];
                    //     cc.log("node._name ",node._name )
                    //     if(node._name == "loadpage") {
                    //         cc.log("loadpage == node._name ",node._name )
                    //     }
                    // }
                }
                cc.myHideView(cc.PanelID.LOADING_PAGE)
            }
        };

        //请求登陆信息的
        var psObjdata = {
            mobile:this.phoneNum,
            password:this.pw
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_login_mobile,psdata,onPostCallBack,this);

       // cc.myShowView(cc.PanelID.LOADING_PAGE,15);  

    },
    //点击前往注册
    onClickGoRegBtn:function(event, customEventData) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //this.node.active = false;//隐藏掉
    
        var perfabsCallBack = function()
        {
            cc.onDestoryView(cc.PanelID.PW_LOGIN);
        };
        cc.myShowView(cc.PanelID.REGISTER,2,null,perfabsCallBack);//进来默认是显示微信登陆
    },

    onEditDidBegan: function(editbox, customEventData) {
        if (customEventData == 1 ) {//手机号的
            this.phoneNum = "";
        }else if(customEventData == 2) {//密码
            this.pw = "";
        }
    },
    // 假设这个回调是给 editingDidEnded 事件的
    onEditDidEnded: function(editbox, customEventData) {

        if (customEventData == 1 ) {//手机号的
           
            this.phoneNum = editbox.string;
        }else if(customEventData == 2) {//密码的
         
            this.pw = editbox.string;
        }
    },
    // 假设这个回调是给 textChanged 事件的
    onTextChanged: function(text, editbox, customEventData) {

    },
    // 假设这个回调是给 editingReturn 事件的
    onEditingReturn: function(editbox,  customEventData) {

    },
    
    showOnLoadingBaseInfo:function() {
        var p = this;
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                    p.onShowMainPage();
                }else{
                   
                }
            }
        }
        HttpHelper.httpPostGetBaseInfo(onPostCallBack);
        cc.myShowView(cc.PanelID.LOADING_PAGE,15); 
    },
  
    onShowMainPage(){
        //延迟下显示
      

        // var callback = function()
        // {
        //     cc.onDestoryView(cc.PanelID.PW_LOGIN);
        //     cc.myShowView(cc.PanelID.MAIN_PAGE,-1,null,null);
        // }
        
        // cc.onLoadAllPrefab(callback);
        //延迟下显示
        var self = this;
        var delayCallBack = function()
        {
            cc.log("=======pw=======loading ok begin ")
            cc.onDestoryView(cc.PanelID.PW_LOGIN);
            cc.myHideView(cc.PanelID.LOADING_PAGE);
            
        }

        var callback = function()
        {
            cc.log("=======pw=======add main page begin ")
            //cc.PerDelayDo(self.node,delayCallBack,2.5,null);
            cc.myShowView(cc.PanelID.MAIN_PAGE,-1,null,delayCallBack);
        }
        cc.log("==============load  prefab  begin ")
        cc.onLoadAllPrefab(callback);

    },

    update (dt) {
        // if ( this.psErr == true) {
        //     var loadpage = cc.UITools.findNode(cc.rootpanel,"loadpage")
        //     cc.log(loadpage)
          
        //     if (loadpage != null) {
        //         this.psErr = false;
        //     }
           
        // }

     },
});
