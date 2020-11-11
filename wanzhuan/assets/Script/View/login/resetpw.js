

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
        topTitleLableNode:cc.Node,
        isComeFromPW:0,
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
        this.regCode = "";
        this.pw1 = "";
        this.pw2 = "";
      
        
        this.leftTimeLabel =  this.leftTimeNode.getComponent(cc.Label);
        this.topTitleLable = this.topTitleLableNode.getComponent(cc.Label);
        this.countTime = 60;//剩余时间可以点击请求验证码的
        this.sRegCode = "";//请求到的注册码
       
    },
    
    setComeFromType(ty)
    {

        this.isComeFromPW = ty;//0 是密码登录哪里进来，1是从其他地方进来
        if (ty == 1) {
            var topTitleLable = this.topTitleLableNode.getComponent(cc.Label);
            cc.log("=======topTitleLable======",topTitleLable)
            if (topTitleLable) {
                topTitleLable.string = "修改密码"
            }
            
        }
    },

     //点击返回按钮
     onClickBackBtn:function(event, customEventData) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
        //this.node.active = false;//隐藏掉
        //隐藏本页
        //返回密码登录 
        cc.log("==============this.isComeFromPW=",this.isComeFromPW)
        if (this.isComeFromPW == 0) {
            var loadPrefabsCallBack = function()
            {
                cc.onDestoryView(cc.PanelID.RESET_PW); 
            }
            cc.myShowView(cc.PanelID.PW_LOGIN,7,null,loadPrefabsCallBack);
            cc.log("====2==========this.isComeFromPW=",this.isComeFromPW)
        }else{
            cc.onDestoryView(cc.PanelID.RESET_PW); 
            cc.log("======1========this.isComeFromPW=",this.isComeFromPW)
        }
        
        
    },

     //点击确认按钮
      onClickComfirtmBtn:function(event, customEventData) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
     
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
                 
                    cc.myHideView(cc.PanelID.LOADING_PAGE);
                    var loadPrefabsCallBack = function()
                    {
                        cc.onDestoryView(cc.PanelID.RESET_PW); 
                    }
                    cc.myShowView(cc.PanelID.PW_LOGIN,2,null,loadPrefabsCallBack);

                }else{
                    cc.showCommTip(ret.msg);//显示错误类型
                    cc.myHideView(cc.PanelID.LOADING_PAGE);
                }
            }
        };

       
        var psObjdata = {
            mobile:this.phoneNum,
            code:this.regCode,
            newpassword:this.pw1,
            renewpassword:this.pw2,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_rest_pw,psdata,onPostCallBack,this);
        cc.myShowView(cc.PanelID.LOADING_PAGE,10); 
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
                }
            }
        };

        //请求注册验证码的
        var psObjdata = {
            mobile:this.phoneNum,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_rest_phonecode,psdata,onPostCallBack,this);

        button.interactable = false;//设置不可点击
        var count = 60;//默认是60
        this.leftTimeLabel.string = count + "s";
        var templeftTimeLabel = this.leftTimeLabel
        this.regCodeBtnNode.active = false;
        this.callback = function () {
            if (count <= 0) {
                templeftTimeLabel.string = "";
                this.unschedule(this.callback);
                button.interactable = true;//设置可点击
                this.regCodeBtnNode.active = true;
            }
            else{
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
  


    // update (dt) {},
});
