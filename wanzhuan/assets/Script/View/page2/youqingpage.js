

cc.Class({
    extends: cc.Component,

    properties: {
     
      numLabelNode:cc.Node,
      jiangliLabel1:cc.Node,
      jiangliLabel2:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
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

    start () {
         
        var numLabel = this.numLabelNode.getComponent(cc.Label);
        var num = cc.UserInfo.getItemNum(191);
        numLabel.string = "我的友情卡："+ num +"张";

        this.shareImgName = "wechat_share_image_screenshot" +  cc.UserInfo.id + ".png";
        this.imgUrl = "";
        var self =this;
        
        //宣传图其实在shouyicenter页面自动去下载了不要重复下载
        // var onPostCallBack  = function(self,ret){
        //     if (ret != -1) {
        //         cc.log("url_share_img ret= ",ret);
        //         if (ret.status == "ok") {//成功
                 
        //             var data = ret.data;
        //             self.toLoadImg(data.url);
              
        //         }else{
        //             //cc.showCommTip(ret.msg);
        //         }
        //     }
        // };
        // var psObjdata = {
        // };
        // var psdata = cc.JsonToPostStr(psObjdata);
       
        // this.wx_img = "";

        // if(CC_JSB) { 
        //     let rootPath = jsb.fileUtils.getWritablePath();
        //     var imgFile = rootPath + this.shareImgName;

        //     if(jsb.fileUtils.isFileExist(imgFile)){//存在
        //         cc.log(" 友情卡 宣传图存在",imgFile);
        //         this.wx_img = imgFile;
        //     }
        //     else{//不存在
        //         cc.log("友情卡 传图不存在",imgFile);
        //         HttpHelper.httpPost(cc.UrlTable.url_share_img,psdata,onPostCallBack,this);//下载请求
        //     }
        // }
        // else{
        //     HttpHelper.httpPost(cc.UrlTable.url_share_img,psdata,onPostCallBack,this);
        // }

        this.onGetPostCfg();
        
    },
    toLoadImg(url)
    {
        var self = this;
      
        var callback = function(frame)
        {
           
        }
        HttpHelper.downloadRemoteImageAndSave(url,callback,this.shareImgName);

    },
     
    onGetPostCfg()
    {
        var jlLabel1 = this.jiangliLabel1.getComponent(cc.Label);
        var jlLabel2 = this.jiangliLabel2.getComponent(cc.Label);

        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("url_get_youqingka_cfg ret= ",ret);
                if (ret.status == "ok") {//成功
                   
                    if (ret.data.line2) {
                        jlLabel2.string = ret.data.line2;
                    }
                    if (ret.data.line1) {
                        jlLabel1.string = ret.data.line1;
                    }
                    
              
                }else{
                    jlLabel2.string = "";
                }
            }
        };
        var psObjdata = {
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_get_youqingka_cfg,psdata,onPostCallBack,this);
        cc.log("onGetPostCfg ret= ",psdata,cc.UrlTable.url_get_youqingka_cfg);
    },
    
    onClickClose(){
       
        cc.onDestoryView(cc.PanelID.YL_YOUQING);
      
    },

    ShareImageToWeChat:function(scene){
        let rootPath = jsb.fileUtils.getWritablePath();
        var imgFile = rootPath + this.shareImgName;

        var  share_path = imgFile ;
        cc.log("ShareImageToWeChat == ",share_path);
      
       if (cc.sys.os == cc.sys.OS_ANDROID) {
            // 1:聊天分享  2:朋友圈分享
            var className = 'org/cocos2dx/javascript/AppActivity';
            var methodName =  "ShareIMGToFriend" 
            if (scene ==  1) {
                methodName = 'ShareIMGToChat';
            }
            var methodSignature = "(Ljava/lang/String;)V"
            jsb.reflection.callStaticMethod(className, methodName, methodSignature,share_path);
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
    // update (dt) {},
});


