

cc.Class({
    extends: cc.Component,

    properties: {
       
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
   
    
    onClickCloseBtn:function(event, customEventData) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
      
        cc.onDestoryView(cc.PanelID.GUIDE_SHOWINVITEPAGE);    
    },

    onClickComfirmBtn:function(event, customEventData) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
      
        this.ShareImageToWeChat(1);
    },
    ShareImageToWeChat:function(scene){
     if (cc.sys.os == cc.sys.OS_ANDROID) {
          let rootPath = jsb.fileUtils.getWritablePath();
          var shareImgName = "wechat_share_image_screenshot" +  cc.UserInfo.id + ".png";
          var imgFile = rootPath + shareImgName;
          cc.log("ShareImageToWeChat == ",share_path);
          var  share_path = imgFile ;
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
    // update (dt) {},
});
