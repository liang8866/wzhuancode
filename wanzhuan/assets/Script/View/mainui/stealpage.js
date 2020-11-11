
cc.Class({
    extends: cc.Component,

    properties: {
       
        panelNode:{
            default: null,
            type: cc.Node
        },
  
        myheadNode: { 
            default: null,
            type: cc.Node
        },
        nameLabelNode: { 
            default: null,
            type: cc.Node
        },
        stealLeftLabelNode: { 
            default: null,
            type: cc.Node
        },
        refreshBtnNode:cc.Node,

        img_bg:cc.Node,
        textlayout:cc.Node,
        topLayout:cc.Node,
        iphonxLayout:cc.Node,
        tmpHeadNode:cc.Node,
    
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            cc.log("cc.getIsIphoneX()  is true")
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.25;
            }
            // this.img_bg.scale = 1.25;
            // this.topLayout.y = this.topLayout.y +cc.iphone_off_Y/2;
          
            this.textlayout.setContentSize(this.textlayout.getContentSize().width,this.textlayout.getContentSize().height + cc.iphone_off_Y);
            this.iphonxLayout.setContentSize(this.iphonxLayout.getContentSize().width,this.iphonxLayout.getContentSize().height + cc.iphone_off_Y);
        }

     },

    start () {
        

        this.retData = null;
        this.hb_list = {};//红包列表
        this.myHbListSuoNode = {};//红包节点
        this.myHbListLabelBg = {};
        this.myHbListLabel= {};//我的红包列表
        this.count = 0;
    
      
       
        this.tmpHeadNode.active = false;
       
        this.shuNode = cc.UITools.findNode(this.panelNode,"p1_shu");
        this.stealLeftLabel = this.stealLeftLabelNode.getComponent(cc.Label);
        
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

       
        this.onShowHongBao();
      
       this.onRefreshStealLeft();//显示剩余次数的
       this.onRefreshDataShow()

    },
    onRefreshStealLeft()//显示剩余次数的
    {
        // this.stealNum = cc.UserInfo.level*2+8- cc.UserInfo.steal_times;//可偷次数
          this.stealNum = cc.UserInfo.hb_list.length - cc.UserInfo.steal_times;//可偷次数
        this.stealLeftLabel.string = "可偷次数："+ this.stealNum +"次"
    },


    onRefreshDataShow(){//刷新显示数据
       
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("=====onRefreshDataShow========",ret);
                if (ret.status == "ok") {//成功
                    self.myheadNode.active = true;
                    self.nameLabelNode.active = true;
                    self.retData = ret.data;
                    self.hb_list= ret.data.hb_list;
                    if (ret.data.head != null && ret.data.head != "" ) {
                         var headSp =   self.myheadNode.getComponent(cc.Sprite);  
                         self.tmpHeadNode.active = false;
                         cc.loadUrlImg(headSp,ret.data.head);//加载图像
                       
                    }else{
                        self.tmpHeadNode.active = true;
                    }
                    var nameLabel = self.nameLabelNode.getComponent(cc.Label);
                    if (self.retData.nickname) {//更新名字
                         //cc.UITools.findLabel(self.nameLabelNode,"namelabel");
                         var nickname = self.retData.nickname.slice(0,8)
                        nameLabel.string = nickname;
                    }else{
                        nameLabel.string = "玩赚乐乐";
                    }

                    self.onShowHongBao();//更新树上的红包
                }else{
                    // self.myheadNode.active = false;
                    // self.nameLabelNode.active = false;
                    cc.showCommTip(ret.msg);
                    //cc.onDestoryView(cc.PanelID.STEALPAGE); 
                }

            }
            cc.myHideView(cc.PanelID.LOADING_PAGE);//隐藏loading
        };
      
        //请求登陆信息的
        var psObjdata = {
            
        };
      //  cc.log("请求刷新偷红包数据。。。",psObjdata);
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_hb_refresh_steal,psdata,onPostCallBack,this);



    },

    onClickBackHome(){
        cc.onDestoryView(cc.PanelID.STEALPAGE); 
    },

    onClickRefreshBtn(){
       

        var self = this
        var btn = this.refreshBtnNode.getComponent(cc.Button);
        btn.interactive = false;

        var delayAct = cc.delayTime(2);
        var seq = cc.sequence(delayAct,cc.callFunc(function(){
            btn.interactive = true;
            cc.myHideView(cc.PanelID.LOADING_PAGE);
           })
         );
        this.refreshBtnNode.runAction(seq)

        self.onRefreshDataShow();

        var callback = function(){
           
           
        }
        cc.myShowView(cc.PanelID.LOADING_PAGE,10,null,callback);//先显示loading
      
        
        var random = parseInt(100 * Math.random() );
        // cc.log("===================",random,random%2)
        if (random % 2 == 0) {
            this.showIAD();//显示插屏广告();
        }

    },

    //显示插屏
    showTTIAD()
    {
  
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showTTIAD', '()V');
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
        
        }
  
    },

    onShowHongBao(){//显示红包那个开锁哪个不开的，刷新剩余时间
        for(let i =1;i<=8;i++){
            this.myHbListSuoNode[i].active = true;
            this.myHbListLabelBg[i].active = true;
            var str = cc.staticData.openHbLv[i] +"级解锁";
            this.myHbListLabel[i].string = str;
            var hbNode = cc.UITools.findNode(this.shuNode,"m_hb"+i);
            hbNode.active =false;
        }
        
        for (let index = 1; index <= this.hb_list.length; index++) {
            var i = index
            const element = this.hb_list[index-1];
            var lt = cc.getTimeLeft(element.cold_time)
            this.myHbListSuoNode[i].active = false;
            var hbNode = cc.UITools.findNode(this.shuNode,"m_hb"+i);
            hbNode.active =true;
            if (lt >= 0 ) {//可以打开了的
                this.myHbListLabelBg[i].active = false;
                this.myHbListLabel[i].string = "可收取";
            }else{//要显示倒计时的
                this.myHbListLabelBg[i].active = true;
                this.myHbListLabel[i].string = cc.formatSeconds(-lt);
            }
        }
    },

    
    onClickHongBao(event, customEventData){//点击红包的
       

        var i = customEventData;
        const element = this.hb_list[i-1];
        var lt = null
        
        if (element) {
            lt = cc.getTimeLeft(element.cold_time)//剩余时间
        }
        //cc.log("onClickHongBao =",lt,element);
        if (lt >= 0 && element != null) {//点击弹出红包页面
            var onPostCallBack  = function(self,ret){
               
                if (ret != -1) {
                    if (ret.status == "ok") {//成功
                        cc.log("===================xxxx",ret)
                     self.onShowSteal(ret.data);
                    }else {
                        cc.showCommTip(ret.msg);
                    }
    
                }
                cc.myHideView(cc.PanelID.LOADING_PAGE);
               
            };


            cc.myShowView(cc.PanelID.LOADING_PAGE,10,null,null);
            //请求偷的信息信息的
            var psObjdata = {
                id:this.hb_list[i-1].id,
            };
            var psdata = cc.JsonToPostStr(psObjdata);
           // cc.log("post 偷红包  ",psdata);
            HttpHelper.httpPost(cc.UrlTable.url_hb_steal,psdata,onPostCallBack,this);

        }
        else if(element == null)
        {
            // var str = "需要等级LV"+ cc.staticData.openHbLv[i] +"才开放"
            

        }
        else if(lt < 0)
        {
            return;
        }
  
    },

    onShowSteal(data){
        var self = this;
        if (data.guess == 0) {//0没有猜宝箱功能，1表示有
            // var callback = function(){
            //     var perfab = cc.allViewMap[cc.PanelID.STAELHONGBAO];
            //     var hongbaoScript = perfab.getComponent('stealhongbao');
            //     hongbaoScript.onShowUi(data);
            // }
            // cc.myShowView(cc.PanelID.STAELHONGBAO,10,null,callback);
            var itemsList = data.reward.items;
            for (let i= 0; i < itemsList.length; i++) {
                var element = itemsList[i];
                var itemData = cc.configMgr.getItemDataById(element[0]);
                // 奖励ID所对应的类型=3，就是红包。
                // 奖励ID所对应的类型=2，就是道具。
                // 奖励ID所对应的类型=4，就是金币。
                if (itemData.type == 3 ) {
                    cc.UserInfo.rmb = Number.parseFloat(cc.UserInfo.rmb) + Number.parseFloat(element[1]);
                }else if (itemData.type == 2) {
                    cc.UserInfo.addItems(element[0],element[1]);
                }
                else if (itemData.type == 4) {
                    cc.UserInfo.gold = Number.parseInt(cc.UserInfo.gold) + Number.parseInt(element[1]);
                }
            }
            var reward = itemsList[0];   
            this.onShowItemReward(reward[0],reward[1]);//显示获得物品
            
        }else{

            // var callback = function(){
            //     var perfab = cc.allViewMap[cc.PanelID.STEALCAICAI];
            //     var caicaiScript = perfab.getComponent('stealcaicai');
            //     cc.showIAD();//显示插屏广告
            // }
            // cc.myShowView(cc.PanelID.STEALCAICAI,10,null,callback);

            cc.UserInfo.showVideoPage = this;
            this.showRewardVideo("4"); //播放视频
        }

        cc.UserInfo.steal_times = data.steal_times;//重置偷的次数
        this.onRefreshStealLeft();//显示剩余次数的
    },  


    onShowItemReward(itemId,num)
    {
      
          //显示获得物品
          var loadPrefabsCallBack = function()
          {
              cc.onDestoryView(cc.PanelID.MAIN_BOX_PAGE);
              var mperfab = cc.allViewMap[cc.PanelID.YL_POPUPPAGE];
              var mscript = mperfab.getComponent('popuppage');
              var itemData = cc.configMgr.getItemDataById(itemId);
              var ty = cc.itemTypeTransformPopType(itemData.type);
              var dd  = itemId;
              if (ty == cc.popviewType.getgold ) {
                  dd = num;
              }
              if (ty == cc.popviewType.getrmb) {
                dd = [itemId,num];
            }
              mscript.onShowUi(ty,dd,null);
              
          }
          cc.myShowView(cc.PanelID.YL_POPUPPAGE,7,null,loadPrefabsCallBack); 
          cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示
    },

     
    //请求打开视频
    showRewardVideo(s)//1,2,3是显示腾讯视频
    {
    if (cc.sys.os == cc.sys.OS_ANDROID) {
    
        jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showRewardVideo', '(Ljava/lang/String;)V',s);
    
        cc.UserInfo.limitTimeViedoFlag =  true;
        cc.UserInfo.limitTime = 1.0;
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    }
    else{
        if (cc.UserInfo.showVideoPage) {
            cc.UserInfo.showVideoPage.onFinishGetReward();
            cc.UserInfo.showVideoPage = null;
            cc.UserInfo.limitTimeViedoFlag =  true;
            cc.UserInfo.limitTime = 15;
        
        }
    }
    },

    onFinishGetReward(){
        var self = this;
        var callback = function(){
                var perfab = cc.allViewMap[cc.PanelID.STEALCAICAI];
                var caicaiScript = perfab.getComponent('stealcaicai');
                self.showIAD();//显示插屏广告
        }
        cc.myShowView(cc.PanelID.STEALCAICAI,10,null,callback);

    },
          //显示插屏
    showIAD()
    {

        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showIAD', '()V');
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
        
        }

    },
  
     update (dt) {
        if ( this.count >=1) {
            this.onShowHongBao();
            this.count = 0;
        }
        this.count =  this.count + dt
        
     },
});
