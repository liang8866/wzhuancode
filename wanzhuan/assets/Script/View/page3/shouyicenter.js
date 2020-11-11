
cc.Class({
    extends: cc.Component,

    properties: {
     

        scrollLayoutNode:cc.Node,
        scrollView:cc.Node,
        clickFlag:false,
        isPreLoadFirst:true,

        freiendNumLabelNode:cc.Node,

        totalInComeLableNode1:cc.Node,
        totalInComeLableNode2:cc.Node,
        jieduanLabelNode:cc.Node,

        todayInComeLabelNode1:cc.Node,
        todayInComeLabelNode2:cc.Node,
        todayInComeLabelNode3:cc.Node,
      
        bwLabelNode1:cc.Node,
        bwLabelNode2:cc.Node,
        bwLabelNode3:cc.Node,

        progressBarNode:cc.Node,
        barDescRichTextNode:cc.Node,

        suduLabelNode:cc.Node,
        eachNumLabelNode:cc.Node,

        popShareBgNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
      this.dowmHeight = 1200;

      if (cc.getIsIphoneX() == true) {
          
          this.scrollLayoutNode.y = this.scrollLayoutNode.y +cc.iphone_off_Y*2.5;
          this.dowmHeight = 1200 + cc.iphone_off_Y*2.5;
          this.scrollLayoutNode.setContentSize(this.scrollLayoutNode.getContentSize().width,this.scrollLayoutNode.getContentSize().height + cc.iphone_off_Y*3);
          this.scrollView.setContentSize(this.scrollView.getContentSize().width,this.scrollView.getContentSize().height + cc.iphone_off_Y*3);
      }

        

        
       
        var self = this;
        var callback = function(){
          self.onGetPostData(); //请求收益中心的数据列表
         
        
        }
        var seq = cc.sequence(cc.delayTime(2.0), cc.callFunc(callback));
        this.node.runAction(seq);
   
     },

    start () {
  
      if (this.isPreLoadFirst == true) {
         this.isPreLoadFirst = false;
         var onDelayCallBackFunc =  function(self)
         {
           self.loadShareImage();
         }
         cc.PerDelayDo(this.node,onDelayCallBackFunc,0.3,this);
      }



    },
    onGetPostData()
    {
         //请求收益中心的数据列表
         var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                  
                    cc.log("请求收益中心 ret= ",ret);
                    self.onRefreshShow(ret.data)
                }
            }
        };
        var psObjdata = {
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_sy_profit_data,psdata,onPostCallBack,this);
    },
    onRefreshShow(data)
    {
      cc.UserInfo.syData = data;
    
      var nameList ={
        1:"一",
        2:"二",
        3:"三",
        4:"四",
        5:"五",
        6:"六",
        7:"七",
        8:"八",
        9:"九",
        10:"十",
      }
      //好友数
      var freiendNumLabel = this.freiendNumLabelNode.getComponent(cc.Label);
      freiendNumLabel.string = cc.UserInfo.invite_num;
      //累计总收益
      var totalInComeLable1 = this.totalInComeLableNode1.getComponent(cc.Label);
      totalInComeLable1.string = cc.UserInfo.friend_rmb;
      //第一阶段 
      var jieduanLabel = this.jieduanLabelNode.getComponent(cc.Label);
      jieduanLabel.string = "第" + nameList[cc.UserInfo.jieduan] +"阶段";

      var friendData = cc.configMgr.getFriendDataByStep(cc.UserInfo.jieduan);
     
      var totalInComeLable2 = this.totalInComeLableNode2.getComponent(cc.Label);
      totalInComeLable2.string =  Number.parseFloat(friendData.accLevel).toFixed(2) ;

      var percent = cc.UserInfo.friend_rmb / friendData.accLevel;//进度
      percent = Number.parseFloat(percent).toFixed(2)
      var progressBar = this.progressBarNode.getComponent(cc.ProgressBar)
      progressBar.progress  = percent;

      var fpercent = Number.parseFloat(percent*100).toFixed(2)
      var nextfriendData = cc.configMgr.getFriendDataByStep(cc.UserInfo.jieduan+1);
      var  richStr =  "<color=#504E4E>已经解锁"+fpercent+"%，达到"+friendData.accLevel+"元自动存入钱包</c>";
      if (nextfriendData != null) {
        richStr = richStr + "<color=#46CA08>x"+ Number.parseFloat(nextfriendData.radio/10000).toFixed(2)+"倍加速</color>"
      }
      var barDescRichText = this.barDescRichTextNode.getComponent(cc.RichText)
      barDescRichText.string = richStr
      
      //-------------------------------------
      //今天好友给我赚钱
      var todayInComeLabel1 = this.todayInComeLabelNode1.getComponent(cc.Label);
      var  totalToday = Number.parseFloat( cc.UserInfo.friend_rmb_level1) + Number.parseFloat( cc.UserInfo.friend_rmb_level2) ;
      todayInComeLabel1.string =Number.parseFloat(totalToday).toFixed(2);

      var todayInComeLabel2 = this.todayInComeLabelNode2.getComponent(cc.Label);
      todayInComeLabel2.string = cc.UserInfo.friend_rmb_level1 ;

      var todayInComeLabel3 = this.todayInComeLabelNode3.getComponent(cc.Label);
      todayInComeLabel3.string = cc.UserInfo.friend_rmb_level2;
      //倍速的
      var suduLabel = this.suduLabelNode.getComponent(cc.Label);
      suduLabel.string = Number.parseFloat(friendData.radio/10000).toFixed(1)+"倍加速";
     
      
     
      //------------------------------百万市场部分-----------

      var bwLabel1 = this.bwLabelNode1.getComponent(cc.Label);
      bwLabel1.string = cc.UserInfo.market;
      if (Number.parseInt(cc.UserInfo.market)<=0 ) {
          cc.UserInfo.market = 1;
      }
      var marketData = cc.configMgr.getmarketDataByLv(cc.UserInfo.market);
      var getMoneyNum = cc.UserInfo.today_video_num / 50 * marketData.money;
      var bwLabel2 = this.bwLabelNode2.getComponent(cc.Label);
      bwLabel2.string =  Number.parseFloat(getMoneyNum).toFixed(2) ;

      var bwLabel3 = this.bwLabelNode3.getComponent(cc.Label);
      bwLabel3.string = cc.UserInfo.today_video_num;


      var eachNumLabel = this.eachNumLabelNode.getComponent(cc.Label);
      eachNumLabel.string = "每30次" + marketData.money +"元" ;

      //移到另外个页面去
      var scrpit = cc.getPageSriptByIndx(5);
      if (scrpit != null) {
          scrpit.setFenHongKaShow(data)
      }
    },


   
    onClickYaoQingGuiZe(){//点击邀请规则
      var self = this;
      if (self.clickFlag) {
        return;
      }
      var loadPrefabsCallBack = function()
      {
        self.clickFlag = false;
      }

      cc.myShowView(cc.PanelID.SY_INVITERULEPAGE,12,null,loadPrefabsCallBack);  
    },
    onClickYaoQingMijie()//点击邀请秘籍
    {
      var self = this;
      if (self.clickFlag) {
        return;
      }
      var loadPrefabsCallBack = function()
      {
        self.clickFlag = false;
      }

      cc.myShowView(cc.PanelID.SY_INVITSECRETPAGE,12,null,loadPrefabsCallBack);  

    },
    onClickMyShouYi(){//点击我的收益
      var self = this;
      if (self.clickFlag) {
        return;
      }
      self.clickFlag = true;
      var loadPrefabsCallBack = function()
      {
        self.clickFlag = false;
      }

      cc.myShowView(cc.PanelID.SY_LOGPAGE,12,null,loadPrefabsCallBack);  
    },
    onClickMyFriend(){//点击我的朋友
      var self = this;
      if (self.clickFlag) {
        return;
      }
      self.clickFlag = true;
      var loadPrefabsCallBack = function(perfab)
      {
        self.clickFlag = false;
         
      }
      cc.myShowView(cc.PanelID.PERSON_WANDUIWU,3,null,loadPrefabsCallBack);
    },
    onClickYaoQing()//点击立即邀请
    {
      this.ShareImageToWeChat(1);

    },

    ShareImageToWeChat:function(scene){
      if (cc.sys.os == cc.sys.OS_ANDROID) {
           let rootPath = jsb.fileUtils.getWritablePath();
           var shareImgName = "wechat_share_image_screenshot" +  cc.UserInfo.id + ".png";
           var imgFile = rootPath + shareImgName;
         
           var  share_path = imgFile ;
           cc.log("ShareImageToWeChat == ",share_path);
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

   loadShareImage()
   {

      this.shareImgName = "wechat_share_image_screenshot" +  cc.UserInfo.id + ".png";
      this.imgUrl = "";
      var self =this;
      var onPostCallBack  = function(self,ret){
          if (ret != -1) {
              cc.log("=========loadShareImage=====  url_share_img ret= ",ret);
              if (ret.status == "ok") {//成功
                  var data = ret.data;
                  self.toLoadImg(data.url);
              }else{
                
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
       var callback = function(frame)
       {
           
       }
       HttpHelper.downloadRemoteImageAndSave(url,callback,this.shareImgName);

   },


   onClickWenHao(event, customEventData){
        var typ = customEventData;
      if (typ == 1 ) {
          var loadPrefabsCallBack = function(perfab)
          {
              var script = perfab.getComponent('wenhaopage');
              script.onShouYiShow(typ);
          }
          cc.myShowView(cc.PanelID.COM_WENHAOPAGE,8,null,loadPrefabsCallBack);  
      }else if (typ == 2) {
        var loadPrefabsCallBack = function(perfab)
        {
          
        }
        cc.myShowView(cc.PanelID.SY_SHOUYIDESCPAGE,8,null,loadPrefabsCallBack);  
      }
      

  },
onClickBwfC(){
    var loadPrefabsCallBack = function(perfab)
    {
       
    }
    cc.myShowView(cc.PanelID.SY_BWDESC,8,null,loadPrefabsCallBack);  

},


onClickCanCel(){
    this.popShareBgNode.active = false;
},
onClickShare(){
    this.popShareBgNode.active = false;
    this.ShareImageToWeChat(1);
},

    // update (dt) {},
});
