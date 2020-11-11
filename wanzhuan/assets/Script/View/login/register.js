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
       
      
        leftTimeNode:{
            default: null,
            type: cc.Node
        },
        maskLayoutNode:cc.Node,
        topLayoyNode:cc.Node,
        regCodeBtnNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.35;
            }
            this.topLayoyNode.y = this.topLayoyNode.y + cc.iphone_off_Y *1.5;
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*6);
          
        }

     },

    start () {
        this.phoneNum = "";
        this.regCode = "";
        this.pw1 = "";
        this.pw2 = "";
        this.isShowFlag = false;
     
        this.leftTimeLabel =  this.leftTimeNode.getComponent(cc.Label);
        this.countTime = 60;//剩余时间可以点击请求验证码的
        this.sRegCode = "";//请求到的注册码

       
    },
     //点击返回按钮
     onClickBackBtn:function(event, customEventData) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //this.node.active = false;//隐藏掉
       //隐藏本页
        //返回密码登录
        var loadPrefabsCallBack = function()
        {
            cc.onDestoryView(cc.PanelID.REGISTER); 
        }

        cc.myShowView(cc.PanelID.WX_LOGINPAGE,2,null,loadPrefabsCallBack);
            
    },

      //点击确认按钮
      onClickComfirtmBtn:function(event, customEventData) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
        if (this.isShowFlag == true) {
            return;
        }
        if (this.phoneNum == "") {
            cc.showCommTip("手机号码不能为空");
            return;
        }
        if (this.pw1 == ""||this.pw2 =="") {
            cc.showCommTip("密码不能为空");
            return;
        }
        if (this.regCode == "") {
            cc.showCommTip("请输入手机验证码")
            return;
        }
        var isPhone =   cc.isPoneAvailable(this.phoneNum);
        if (isPhone == false) {
            cc.showCommTip("请输入正确手机号码");
            return;
        }
        
        if (this.pw1 !== this.pw2) {
            cc.showCommTip("密码不一致")
            return;
        }
        var isPw1 =   cc.isPasswd(this.pw1);
        var isPw2 =   cc.isPasswd(this.pw2);
        if (isPw1 == false ||isPw2 == false) {
            cc.showCommTip("密码错误")
            return;
        }
       

        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                    cc.log("注册成功 ret",ret);
                   
                    if (ret.data.token != null) {
                        cc.UserInfo.token = ret.data.token;//记录token
                        cc.mySetTakenLocal(cc.UserInfo.token );//保存起来
                        self.showOnLoadingBaseInfo();//获取基本信息
                    }
                    else{
                        cc.myHideView(cc.PanelID.LOADING_PAGE);
                        var loadPrefabsCallBack = function()
                        {
                            cc.onDestoryView(cc.PanelID.REGISTER); 
                        }
                        cc.myShowView(cc.PanelID.PW_LOGIN,2,null,loadPrefabsCallBack);
                    }
                }else{
                    cc.myHideView(cc.PanelID.LOADING_PAGE);
                    cc.showCommTip(ret.msg);//显示错误类型
                }
            }
        };

        // //请求注册信息的
        var psObjdata = {
            mobile:this.phoneNum,
            code:this.regCode,
            password:this.pw1,
            repassword:this.pw2,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_reg_bymobile,psdata,onPostCallBack,this);
        cc.myShowView(cc.PanelID.LOADING_PAGE,10); 
     
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
    },

    onShowMainPage(){
        //延迟下显示
        var callback = function(){
            // cc.myHideView(cc.PanelID.PW_LOGIN);
            cc.myHideView(cc.PanelID.LOADING_PAGE);
            cc.onDestoryView(cc.PanelID.REGISTER)
        }
        var seq = cc.sequence(cc.delayTime(4.0), cc.callFunc(callback));
        this.node.runAction(seq);
        cc.myShowView(cc.PanelID.MAIN_PAGE,-1,null,null);
    },




    //点击请求验证吗
    onClickRegCode:function(event, customEventData){
        var node = event.target;
        var button = node.getComponent(cc.Button);
        var isPhone =   cc.isPoneAvailable(this.phoneNum);
        if (isPhone == false) {
            cc.showCommTip("请输入正确手机号码");
            return;
        }

        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                   print("ret = ",ret);
                   //this.sRegCode = "";//请求到的注册码
                }else{
                    cc.showCommTip(ret.msg);//显示错误类型
                    self.unschedule(self.callback);
                    self.leftTimeLabel.string = "";
                    button.interactable = true;//设置可点击
                }
            }
        };

        //请求注册验证码的
        var psObjdata = {
            mobile:this.phoneNum,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_reg_code,psdata,onPostCallBack,this);

        button.interactable = false;//设置不可点击
        this.regCodeBtnNode.active = false;
        var count = 60;//默认是60
        this.leftTimeLabel.string = count + "s";
        var templeftTimeLabel = this.leftTimeLabel
        this.callback = function () {
            if (count <= 0) {
                templeftTimeLabel.string = "";
                this.unschedule(this.callback);
                button.interactable = true;//设置可点击
                this.regCodeBtnNode.active = true;
            }else{
                count =  count - 1;
                templeftTimeLabel.string = count + "s";
            }
           
        }
     
        this.schedule(this.callback, 1,this);

    },
    
    onEditDidBegan: function(editbox, customEventData) {
        if (customEventData == 1 ) {//手机号的
            this.phoneNum = "";
        }else if(customEventData == 2) {//验证码
          
        }
        else if(customEventData == 3) {//密码1
            this.pw = "";
        }
        else if(customEventData == 4) {//密码2
            this.pw = "";
        }
    },
    // 假设这个回调是给 editingDidEnded 事件的
    onEditDidEnded: function(editbox, customEventData) {
        var str = editbox.string;
        if (customEventData == 1 ) {//手机号的
            this.phoneNum =str;
        }else if(customEventData == 2) {//验证码
          this.regCode = str;
        }
        else if(customEventData == 3) {//密码1
            this.pw1 = str;
        }
        else if(customEventData == 4) {//密码2
            this.pw2 = str;
        }
        
    },
    // 假设这个回调是给 textChanged 事件的
    onTextChanged: function(text, editbox, customEventData) {
     
    },
    // 假设这个回调是给 editingReturn 事件的
    onEditingReturn: function(editbox,  customEventData) {
      
    },
  
    
     update (dt) {
       
     },
});
