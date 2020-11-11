
cc.Class({
    extends: cc.Component,

    properties: {
        GgRichNode: { //公告的
            default: null,
            type: cc.Node
        },
        CashLabelNode: { //现金的
            default: null,
            type: cc.Node
        },
        CoinLabelNode: { //金币的
            default: null,
            type: cc.Node
        },
        BoxLetfTimeLableNode:{ //BX剩余时间的
            default: null,
            type: cc.Node
        },
        
        LevelLabelNode: { //树等级的
            default: null,
            type: cc.Node
        },

        panelNode:{
            default: null,
            type: cc.Node
        },
        panelNode2:{
            default: null,
            type: cc.Node
        },
       bxNode:{
        default: null,
        type: cc.Node
       },

        img_bg:cc.Node,
        textlayout:cc.Node,
        topLayout:cc.Node,
        iphonxLayout:cc.Node,
        count:0,
        signinNode:cc.Node,
      
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            //this.img_bg.scale = 1.25;
            //this.topLayout.y = this.topLayout.y +cc.iphone_off_Y/2;
            this.textlayout.setContentSize(this.textlayout.getContentSize().width,this.textlayout.getContentSize().height + cc.iphone_off_Y);
            this.iphonxLayout.setContentSize(this.iphonxLayout.getContentSize().width,this.iphonxLayout.getContentSize().height + cc.iphone_off_Y*1.5);
        }

     },

    start () {
        
    
        this.myHbListSuoNode = {};//红包节点
        this.myHbListLabelBg = {};
        this.myHbListLabel= {};//我的红包列表
        this.count = 0;

        this.isClickFlag = false;

        this.CashLabel = this.CashLabelNode.getComponent(cc.Label);
        this.CoinLabel = this.CoinLabelNode.getComponent(cc.Label);
        this.BoxLetfTimeLable = this.BoxLetfTimeLableNode.getComponent(cc.Label);
        this.LevelLabel = this.LevelLabelNode.getComponent(cc.Label);
        this.bxBtn =  this.bxNode.getComponent(cc.Button);
       
        this.shuNode = cc.UITools.findNode(this.panelNode,"p1_shu");
        var locCanvas = cc.game.canvas;
        var locContainer = cc.game.container;
       // this.tipLabel.string = "locCanvas:height="+ locCanvas.height + "   width:"+locCanvas.width + "   locContainer:w="+ locContainer.width + "  h= "+locContainer.height;
        
        for(let i =1;i<=8;i++){
            var hbNode = cc.UITools.findNode(this.shuNode,"m_hb"+i);
            var suoNode = cc.UITools.findNode(hbNode,"hb_suo");
            var p1_counttime_bg = cc.UITools.findNode(hbNode,"p1_counttime_bg");
            var left_label = cc.UITools.findLabel(hbNode,"left_label");
            this.myHbListSuoNode[i]= suoNode;
            this.myHbListLabelBg[i] = p1_counttime_bg;
            this.myHbListLabel[i] = left_label;
            left_label.string = "";
            cc.DelayActionUpDownAction(hbNode);
        }

        this.onRefreshDataShow();
        this.onShowHongBao();
        this.onShowBaoXiang();

        //显示动态的那个

        // var loadPrefabsCallBack = function()
        // {
        //     var perfab = cc.allViewMap[cc.PanelID.MAIN_DONGTAI];
        //     var script = perfab.getComponent('dongtai');
        //     perfab.zIndex = 10;
        // }
        //  cc.myShowView(cc.PanelID.MAIN_DONGTAI,9,this.panelNode2,loadPrefabsCallBack);  
        
        this.nextShowGG();//显示公告

        var self = this;
        var callback = function(){
            self.onSetSignMiss()
            self.onGetNewUserReward()
        }
        var seq = cc.sequence(cc.delayTime(1.5), cc.callFunc(callback));
        this.node.runAction(seq);
       

    },
    onRefreshDataShow(){//刷新显示数据
        
        // this.CashLabel.string = Number(cc.UserInfo.rmb).toFixed(2) + "元";
        // this.CoinLabel.string =  Number(cc.UserInfo.diamond).toFixed(2);
        this.CashLabel = this.CashLabelNode.getComponent(cc.Label);
        if (this.CashLabel) {
            this.CashLabel.string = Number(cc.UserInfo.rmb).toFixed(2) + "元";
        }
        this.CoinLabel = this.CoinLabelNode.getComponent(cc.Label);
        if ( this.CoinLabel) {
            this.CoinLabel.string =  Number(cc.UserInfo.diamond).toFixed(2);
        }
        this.LevelLabel = this.LevelLabelNode.getComponent(cc.Label);
        if (this.LevelLabel) {
            this.LevelLabel.string = cc.UserInfo.level;
        }
    },

    onShowHongBao(){//显示红包那个开锁哪个不开的，刷新剩余时间
        for(let i =1;i<=8;i++){
            this.myHbListSuoNode[i].active = true;
            this.myHbListLabelBg[i].active = true;
            var str = cc.staticData.openHbLv[i] +"级解锁";
            if (i==4) {
                str =  "邀请2名好友解锁";
            }
            if (i==5) {
                str =  "邀请5名好友解锁";
            }
            
            this.myHbListLabel[i].string = str;
        }
        
        for (let index = 1; index <= cc.UserInfo.hb_list.length; index++) {
            var i = index
            const element = cc.UserInfo.hb_list[index-1];
            var lt = cc.getTimeLeft(element.cold_time)
            this.myHbListSuoNode[i].active = false;
          
            if (lt >= 0 ) {//可以打开了的
                
                this.myHbListLabelBg[i].active = true;
                this.myHbListLabel[i].string = "可收取";
                // if (i == 4 && cc.UserInfo.invite_num >= 2 ) {
                //     this.myHbListLabelBg[4].active = true;
                //     this.myHbListLabel[4].string = "可收取";
                // }
                // if (i == 5  && cc.UserInfo.invite_num >= 5) {
                //     this.myHbListLabelBg[5].active = true;
                //     this.myHbListLabel[5].string = "可收取";
                   
                // }
            }else{//要显示倒计时的
                this.myHbListLabelBg[i].active = true;
                this.myHbListLabel[i].string = cc.formatSeconds(-lt);
            }
            
        }
    },

    onShowBaoXiang(){//显示宝箱的状态
        // =1 可领取，=0 不显示 如果是时间显示的是剩余时间
        //于1可领取 —> “已完成”，小于当前不显示 —> “没有宝箱”， 
        //  大于当前时间，显示任务倒计时 —> “有宝箱，但未完成”
        
        if (cc.UserInfo.box_status == 0) {
            this.bxNode.active = false;
            this.BoxLetfTimeLableNode.active =false;
        }
        else if (cc.UserInfo.box_status == 1) {
            this.bxNode.active = true;
            this.BoxLetfTimeLableNode.active =true;
           // this.bxBtn.interactable = true;
           this.BoxLetfTimeLable.string = "可领取"
        }
        else if (cc.UserInfo.box_status > 1) {
           // this.bxBtn.interactable = false;
            var lt = cc.getTimeLeft(cc.UserInfo.box_status)
            if (lt>0) {//说明过期了，不显示
                this.bxNode.active = false;
                this.BoxLetfTimeLableNode.active =false;
              
            }else{//显示倒计时
                this.bxNode.active = true;
                this.BoxLetfTimeLableNode.active =true;
                this.BoxLetfTimeLable.string = cc.formatSeconds(-lt) + "后消失";
            }
          
        }

    },


    onClickGongLie(){//点击攻略
      
    },
    onClickBx(){//点击宝箱
        if (this.isClickFlag ==  true) {
            return;
        }
        this.isClickFlag = true;

        var self =this;
        var callback = function(){
            var oPerfab = cc.allViewMap[cc.PanelID.MAIN_BOX_PAGE];
            var oScript = oPerfab.getComponent('mainboxpage');
            oScript.onSetParentScript(self);
            self.isClickFlag = false;
        }
        cc.myShowView(cc.PanelID.MAIN_BOX_PAGE,10,null,callback);
    },
    onClickGetCrash(){//点击提现
        cc.myShowView(cc.PanelID.PERSON_TIXIAN,3,null,null);
    },
    onClickTouHb(){//点击偷红包
        if (this.isClickFlag ==  true) {
            return;
        }
        this.isClickFlag = true;
        //this.panelNode2.active = true;
       // var panelNode =  this.panelNode;
       var self =this;
        var loadPrefabsCallBack = function()
        {
            self.isClickFlag = false;
            //panelNode.active = false;
            cc.UserInfo.guideClick = true;//第4步点点击偷红包
        }

        cc.myShowView(cc.PanelID.STEALPAGE,-1,this.panelNode2,loadPrefabsCallBack);  

    },
    onClickHongBao(event, customEventData){//点击红包的
        if (this.isClickFlag ==  true) {
            return;
        }
        this.isClickFlag = true;
        var self = this;

        var i = customEventData;
        const element = cc.UserInfo.hb_list[i-1];
        var lt = null
      
        if (element) {
            lt = cc.getTimeLeft(element.cold_time)//剩余时间
        }
        
        if (lt >= 0 && element != null) {//点击弹出红包页面
            // cc.log("====xxxx",customEventData, lt)
            var showCallBack = function(){
                var openhbPerfab = cc.allViewMap[cc.PanelID.OPEN_HONGBAO_PAGE];
                var openHbScript = openhbPerfab.getComponent('openhongbao');
                openHbScript.setHongBaoShow(i);
                self.isClickFlag = false;
                cc.UserInfo.guideClick = true;//第一步点红包
            }  
            cc.myShowView(cc.PanelID.OPEN_HONGBAO_PAGE,3,null,showCallBack);
            //self.showGetHongBaoPost(i);


        }else if(element == null)
        {
            // var str = "需要等级LV"+ cc.staticData.openHbLv[i] +"才开放"
            self.isClickFlag = false;

        }
        else if(lt < 0)
        {   
            cc.showCommTip("倒计时未结束");
            // var showCallBack = function(){
            //     var perfab = cc.allViewMap[cc.PanelID.JIASU];
            //     var script = perfab.getComponent('jiasupage');
            //     script.onSetHongBaoId(element.id,self);
                 self.isClickFlag = false;
           

            // }  
            // cc.myShowView(cc.PanelID.JIASU,3,null,showCallBack);
            return;
        }
  
    },

    showGetHongBaoPost(id)
    {
        this.hbIdx = id;
        var hongbaoIdx = id;
        var self = this;
        if (this.flagOpen == true) {
            return;
        }
        this.flagOpen = true;
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                  cc.log("=========showGetHongBaoPost==========",ret)
                   self.showHongBaoDetail(hongbaoIdx,ret.data)

                }
            }
        };
        // cc.log("----------",this.hbIdx,hongbaoIdx);
        //请求登陆信息的
        var psObjdata = {
            id:cc.UserInfo.hb_list[hongbaoIdx-1].id,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_hb_open,psdata,onPostCallBack,this);

        cc.UserInfo.guideClick = true;//第2步点打开红包

    },
    showHongBaoDetail(id,hbData){
        var hbid = id -1;
      
        cc.UserInfo.serverTime = hbData.server_time;
        cc.UserInfo.box_status = hbData.box_status;
        if ( cc.UserInfo.hb_list[hbid].id == hbData.id) {
            cc.UserInfo.hb_list[hbid].cold_time = hbData.cold_time;
        }

      
        var  num = 0;
        if (hbData.reward.diamond != null) {
            num = hbData.reward.diamond ;
            cc.UserInfo.diamond  =   Number.parseFloat(cc.UserInfo.diamond)+  Number.parseFloat(hbData.reward.diamond);
        }else if (hbData.reward.gold != null)
        {
            num = hbData.reward.gold ;
            cc.UserInfo.gold  = Number.parseInt(cc.UserInfo.gold) +  Number.parseInt(hbData.reward.gold);
        }
        else if (hbData.reward.rmb != null)
        {
            num = hbData.reward.rmb ;
            cc.UserInfo.rmb =  Number.parseFloat(cc.UserInfo.rmb) +  Number.parseFloat(hbData.reward.rmb);
        }
        cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示


          //显示获得物品
          this.flagOpen = false;
          var loadPrefabsCallBack = function()
          {
              cc.onDestoryView(cc.PanelID.YL_EXPLOREEXCHANGE);
              var mperfab = cc.allViewMap[cc.PanelID.YL_POPUPPAGE];
              var mscript = mperfab.getComponent('popuppage');
              mscript.onShowUi(cc.popviewType.getgold, num,null);
            
          }
          cc.myShowView(cc.PanelID.YL_POPUPPAGE,7,null,loadPrefabsCallBack); 
    },

   

    showGongGao(){//显示公告
        //cc.log("cc.UserInfo.messageList: ",cc.UserInfo.messageList.length);
        if (cc.UserInfo.messageList.length == 0) {
          
            return;
        }
        var richText = this.GgRichNode.getComponent(cc.RichText);
   
        var maxId =  cc.UserInfo.messageList[0].id;
        var itemdata =  cc.UserInfo.messageList[0];
        for (let index = 0; index < cc.UserInfo.messageList.length; index++) {
            const element = cc.UserInfo.messageList[index];
            if (parseInt(element.id) > parseInt(maxId) ) {
                maxId = element.id;
                itemdata = element;
            }
        }
        richText.string = cc.getGgRichString(itemdata);
        this.GgRichNode.x = 320;
        var self = this;
        var callback = function(){
            self.nextShowGG();
        }
        var seq = cc.sequence(cc.moveTo(15,-1000, 0), cc.callFunc(callback));
        this.GgRichNode.runAction(seq);

    },

    nextShowGG(){
        var self = this;
        var callback = function(){
            self.showGongGao();
        }
        var seq = cc.sequence(cc.delayTime(5), cc.callFunc(callback));
        this.GgRichNode.runAction(seq);
    },
 
     update (dt) {
         //cc.log("this.count=",this.count);
        if ( this.count >=0.5) {
            this.onShowHongBao();
            this.onShowBaoXiang();
            this.count = 0;
        }
        this.count =  this.count + dt
        
     },

     //签到按钮
     onClickSign(){
        var self = this;
        var loadPrefabsCallBack = function()
        {
           
            var perfab = cc.allViewMap[cc.PanelID.YL_SIGNSIN];
            var script = perfab.getComponent('signinpage');
           
        }

        cc.myShowView(cc.PanelID.YL_SIGNSIN,6,null,loadPrefabsCallBack);  

    },

    onSetSignMiss(){
        if (cc.UserInfo.signin >= 7) {
         this.signinNode.active = false;
        }
       
     },

     //获取新手奖励
     onGetNewUserReward()
     {
         cc.log("====================onGetNewUserReward = cc.UserInfo.new_user",cc.UserInfo.new_user)
        if (cc.UserInfo.new_user == 1) {
            
            return
        }
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                cc.log("= 请求新手奖励的  ",ret)
                   
                    self.onShowYLHongBao(ret.data.reward)
                }
            }
        };
        
        var psObjdata = {
           
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_new_user_reward,psdata,onPostCallBack,this);

     },

     onShowYLHongBao(reward)//显示红包
     {
         cc.UserInfo.rmb = Number.parseFloat(cc.UserInfo.rmb) + Number.parseFloat(reward.rmb);
         cc.refreshMoneyShow();
         var self = this;
         var loadPrefabsCallBack = function()
         {
            
             var perfab = cc.allViewMap[cc.PanelID.YL_GETHONGBAO];
             var script = perfab.getComponent('gethbpage');
             script.onshowHbUi(reward);
         }
 
         cc.myShowView(cc.PanelID.YL_GETHONGBAO,6,null,loadPrefabsCallBack);  
 
     },

     onClickTipGetFenhongKa(event, customEventData)
     {
        var node = event.target;
        var curButton = node.getComponent(cc.Button);
        curButton.interactable = false;
        var loadPrefabsCallBack = function()
        {
            curButton.interactable = true;
            
        }
        cc.myShowView(cc.PanelID.FUSHUFENHONGKADESC,7,null,loadPrefabsCallBack);

     },
 
});
