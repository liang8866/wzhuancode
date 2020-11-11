
cc.Class({
    extends: cc.Component,

    properties: {
        shareImgbg:cc.Node,
        nickNameNode:cc.Node,
        iconNode:cc.Node,
        maskLayoutNode:cc.Node,
        erweimaNode:cc.Node,
        topLayoutNode:cc.Node,
        sharedowmLayout:cc.Node,
        xuanChuanNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.35;
            }
            this.topLayoutNode.y = this.topLayoutNode.y +cc.iphone_off_Y*2
            this.sharedowmLayout.y = this.sharedowmLayout.y - cc.iphone_off_Y*2;
           
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*6);
        }
        
     },

    start () {
        
        this.shareImgName = "wechat_share_image_screenshot" +  cc.UserInfo.id + ".png";
        if (cc.getIsIphoneX() == true) {
           this.shareImgbg.scale =1.25
           cc.log("=====1======== this.topLayoutNode.y===================", this.topLayoutNode.y)
        }
        else{
            this.topLayoutNode.y = 640;
            cc.log("======2======= this.topLayoutNode.y===================", this.topLayoutNode.y)
        }
        
        this.nickName = this.nickNameNode.getComponent(cc.Label);
        this.nickName.string = cc.UserInfo.nickname;
        if (cc.UserInfo.head != null && cc.UserInfo.head != "") {
            var headSp =   this.iconNode.getComponent(cc.Sprite); 
            cc.loadUrlImg(headSp,cc.UserInfo.head);//加载图像
            this.isChangeIcon = false;
        }

        this.imgUrl = "";
        var self =this;
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("url_share_img ret= ",ret);
                if (ret.status == "ok") {//成功
                    var data = ret.data;
                    self.toLoadImg(data.url);
                }else{
                    cc.showCommTip(ret.msg);
                }
               
            }
        };
        var psObjdata = {
        };
        var psdata = cc.JsonToPostStr(psObjdata);
       
        this.wx_img = "";

        if(CC_JSB) { 
            let rootPath = jsb.fileUtils.getWritablePath();
            var imgFile = rootPath + this.shareImgName;

            if(jsb.fileUtils.isFileExist(imgFile)){//存在
                cc.log(" 存在",imgFile);
                this.wx_img = imgFile;
                cc.loader.load({url:imgFile,type:'png'},function(err,tex){
                    self.xuanChuanNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                  });
                 this.xuanChuanNode.active = true;
                 this.shareImgbg.active = false;
                 this.onDelayShowDown();
            }
            else{//不存在
                cc.log(" 不存在",imgFile);
                HttpHelper.httpPost(cc.UrlTable.url_share_img,psdata,onPostCallBack,this);//下载请求
            }
        }
        else{
            HttpHelper.httpPost(cc.UrlTable.url_share_img,psdata,onPostCallBack,this);
        }


    },
    toLoadImg(url)
    {
        var self = this;
        cc.loadUrlImg(self.xuanChuanNode.getComponent(cc.Sprite),url);
        var callback = function(frame)
        {
            self.xuanChuanNode.active = true;
            self.shareImgbg.active = false;
            self.onDelayShowDown();
        }
        HttpHelper.downloadRemoteImageAndSave(url,callback,this.shareImgName);

    },
     
    onDelayShowDown()
    {
        var self = this;
       
        var delayAct = cc.delayTime(0.3);
        var moveby = cc.moveBy(0.15,cc.v2(0,120));
       
        var seq = cc.sequence(delayAct,moveby,cc.callFunc(function(){
            //同时截图到本地
            self.sharedowmLayout.stopAllActions();
            //self.shootImgToWritePath();
            self.shareImgbg.scale = 0.75;
            self.xuanChuanNode.scale = 0.75;
           })
         );
         self.sharedowmLayout.runAction(seq);

         var delayAct1 = cc.delayTime(0.5);
         var moveby1 = cc.moveBy(0.3,cc.v2(0,-100-cc.iphone_off_Y*3));
         var seq1 = cc.sequence(delayAct1,moveby1);
         self.topLayoutNode.runAction(seq1);


    },

   // 截图分享
   shootImgToWritePath: function () {
    // 注意，EditBox，VideoPlayer，Webview 等控件无法被包含在截图里面
    // 因为这是 OpenGL 的渲染到纹理的功能，上面提到的控件不是由引擎绘制的\
    cc.log("shareCaptureScreen CC_JSB = ",CC_JSB);
    if(CC_JSB) {
        cc.log("this.shareImgName, = ",this.shareImgName,)
        var renderTexture = cc.RenderTexture.create(720,1280);
        var self = this
        // 实际截屏的代码
        renderTexture.begin();
        this.shareImgbg._sgNode.visit();
        renderTexture.end();
        renderTexture.saveToFile(this.shareImgName,cc.ImageFormat.PNG);
           
        }
},


    onClickExit()
    {
        cc.onDestoryView(cc.PanelID.SY_SHAREWECHAT); 
    },

       // 微信截图分享
    // @share_path 截图的路径
    ShareImageToWeChat:function(scene){
        let rootPath = jsb.fileUtils.getWritablePath();
        var imgFile = rootPath + this.shareImgName;

        var  share_path = imgFile ;
        cc.log("ShareImageToWeChat == ",share_path);
      
       if (cc.sys.os == cc.sys.OS_ANDROID) {
            // 1:聊天分享  2:朋友圈分享
            var className = 'org/cocos2dx/javascript/AppActivity';
            var methodName =  "ShareIMGToFriend" // 'ShareIMGToChat';
            if (scene ==  1) {
                methodName = 'ShareIMGToChat';
            }
           
            var methodSignature = "(Ljava/lang/String;)V"
            jsb.reflection.callStaticMethod(className, methodName, methodSignature,share_path);
            
            // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Test", "hello", "(Ljava/lang/String;)V", "this is a message from js");
            // //调用第一个sum方法
            // var result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Test", "sum", "(II)I", 3, 7);
            // var result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Test", "sum", "(I)I", 3);

        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            
        }

    },

   
    onClickShareChat()
    {
        this.ShareImageToWeChat(1);
        
    },
    onClickShareFriendQuan()
    {
        this.ShareImageToWeChat(2);
    },
    onClickSaveImage()
    {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
           // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "saveTextureToLocal", "(Ljava/lang/String;)V",  this.wx_img);
            cc.showCommTip("已保存到相册");
        }

    }

    // update (dt) {},
});
