
cc.Class({
    extends: cc.Component,

    properties: {
    
        ylpage: {//
            default: null,
            type: cc.Node
        },
       longIconNode:{//
            default: null,
            type: cc.Node
        },
        nameRichTextNode: {//左上角的名字和阶级
            default: null,
            type: cc.Node
        },
        myJinYuanLabelNode: {//
            default: null,
            type: cc.Node
        },
        myJinBiLabelNode: {//
            default: null,
            type: cc.Node
        },
        yongjiuFenhongLabelNode:{//
            default: null,
            type: cc.Node
        },
        linshiFenhongLabelNode:{
            default: null,
            type: cc.Node
        },
        ggShouYiLableNode:{//
            default: null,
            type: cc.Node
        },
        longJieLabelNode:{//下面中间招龙的阶
            default: null,
            type: cc.Node
        },
        longNeedMoenyLabelNode:{//下面中间招龙需要的金钱
            default: null,
            type: cc.Node
        },
        zhaolongiconNode:{//下面中间招龙的icon
            default: null,
            type: cc.Node
        },
        long_prefab:{  //项的资源预制体
            type:cc.Prefab,
            default:null,
        },
        huishouBtnNode:cc.Node,
        longPosList:[],//位置列表
        longNodeList:[],//龙的节点
        countTime:0,//计时器

        mainBgNode:cc.Node,
        toplayoutNode:cc.Node,
        downLayoutNode:cc.Node,
        topBgNode:cc.Node,
        hetieff_prefab:{  //项的资源预制体
            type:cc.Prefab,
            default:null,
        },

      
        levelrewardNode:cc.Node,
        noGetRewardLv:3,

        ggNode:cc.Node,
        gonggaoRichNode: { //公告的
            default: null,
            type: cc.Node
            },
        maxId:"0",    
        countPostLevelTime:0,
        
        outGetGoldLabl:cc.Node,
        getCardPercentLabel:cc.Node,
        zhuliLabel1:cc.Node,
        zhuliLabel2:cc.Node,
        zhuliLabel3:cc.Node,
        progressBarNode:cc.Node,
      
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            this.toplayoutNode.y = this.toplayoutNode.y + cc.iphone_off_Y*2.0 +5;
            this.downLayoutNode.y = this.downLayoutNode.y  - cc.iphone_off_Y/2;
            this.huishouBtnNode.y = this.huishouBtnNode.y  - cc.iphone_off_Y/2;
            this.mainBgNode.setContentSize(this.mainBgNode.getContentSize().width,this.mainBgNode.getContentSize().height + cc.iphone_off_Y*2.2);
            this.topBgNode.setContentSize(this.topBgNode.getContentSize().width,this.topBgNode.getContentSize().height + cc.iphone_off_Y);
            this.ggNode.y = this.ggNode.y  - cc.iphone_off_Y/2;
           
        }
        this.clickFlag = false;
        var self = this;
        var callback = function(){
            self.getLongData();
         
            self.onRefreshLevelReward();
            self.onPostlevelmsgData();
        }
        var seq = cc.sequence(cc.delayTime(1.5), cc.callFunc(callback));
        this.node.runAction(seq);

        this.setSystemMsg();
        this.showMsIdx = 0;
        this.showGongGao();

        
     },

    start () {
       
        this.maxId = "0";
        this.countPostLevelTime = 0;
        
        this.refreshUiShow();
        cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示
       
        this.longPosList = [];
        for (let i = 1; i < 13; i++) {
            var posNode = cc.UITools.findNode(this.ylpage,"pos"+i);
            var pos = cc.v2(posNode.x-4,posNode.y-20);
            this.longPosList.push(pos);
        }
        this.isPostData  = true
        
    },

    getLongData(){
        //请求龙的数据列表
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                    cc.UserInfo.longList = ret.data.list;
                    cc.UserInfo.long_num_List = ret.data.long_list_num;
                    cc.log("养龙 ret= ",ret);
                    cc.UserInfo.bonus_data = ret.data.bonus_data;
                    cc.UserInfo.gold =  Number( ret.data.gold) + Number(ret.data.offline_gold);//金币的
                    
                    cc.refreshMoneyShow();//刷显示
                    self.onShowAllLong();//显示龙
                    self.refreshUiShow();//刷新UI显示的
                    self.updateOutGetGoldSpeed();////更新显示获得金币速度
                    
                   
                }
            }
        };
        var psObjdata = {
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_long_get_long_data,psdata,onPostCallBack,this);
    },


    refreshUiShow(){//刷新UI显示的
        var nameRichText = this.nameRichTextNode.getComponent(cc.RichText);//名字
        var myJinYuanLabel = this.myJinYuanLabelNode.getComponent(cc.Label);//金元
        var myJinBiLabel = this.myJinBiLabelNode.getComponent(cc.Label);// 金币
        var yongjiuFenhongLabel = this.yongjiuFenhongLabelNode.getComponent(cc.Label);//永久分红
        var linshiFenhongLabel = this.linshiFenhongLabelNode.getComponent(cc.Label);// 临时分红
        var ggShouYiLable = this.ggShouYiLableNode.getComponent(cc.Label);// 广告收益
        

        myJinYuanLabel.string = Number(cc.UserInfo.diamond).toFixed(2);
        myJinBiLabel.string =  parseInt(cc.UserInfo.gold);
        if (  cc.UserInfo.bonus_data != null && cc.UserInfo.bonus_data.permanent_bonus != null) {
            yongjiuFenhongLabel.string = cc.UserInfo.bonus_data.permanent_bonus;
        }
        if (  cc.UserInfo.bonus_data != null && cc.UserInfo.bonus_data.tmp_bonus!= null) {
            linshiFenhongLabel.string = cc.UserInfo.bonus_data.tmp_bonus;
        }

        if ( cc.UserInfo.bonus_data != null && cc.UserInfo.bonus_data.today_bonus!= null) {
            ggShouYiLable.string = cc.UserInfo.bonus_data.today_bonus;
        }


        //---设置头像的和名字的
        var longIcon = this.longIconNode.getComponent(cc.Sprite);
        var longId = 1000 + Number(cc.UserInfo.level);
        var data = cc.configMgr.configMap[cc.cfg_Name.longBaseData][longId];
        if (data != null) {
            cc.setLongIcon(data.iconName,longIcon);
            nameRichText.string = this.getNameRichStr(data.name,cc.UserInfo.level);
        }
        
       var CardPercentLabel = this.getCardPercentLabel.getComponent(cc.Label);
       var progressLabl1 =  this.zhuliLabel1.getComponent(cc.Label);
       var progressLabl2 =  this.zhuliLabel2.getComponent(cc.Label);
       var progressLabl3 =  this.zhuliLabel3.getComponent(cc.Label);
    
       var allProgress =  Number.parseFloat(cc.UserInfo.progress1) +  Number.parseFloat(cc.UserInfo.progress2)+  Number.parseFloat(cc.UserInfo.progress3);
       //cc.log("=====",cc.UserInfo.progress1,cc.UserInfo.progress2,cc.UserInfo.progress3,allProgress);
       allProgress = Number.parseFloat(allProgress).toFixed(2);
       CardPercentLabel.string =  allProgress + "%";
       progressLabl1.string = cc.UserInfo.progress1 + "%";
       progressLabl2.string = cc.UserInfo.progress2 + "%";
       progressLabl3.string = cc.UserInfo.progress3 + "%";

       var progressBar = this.progressBarNode.getComponent(cc.ProgressBar)
    //cc.log("=============progressBar==",progressBar.progress )
       progressBar.progress  = allProgress/100.0;
        this.refreshZhaoLongBtnInfo();
    },

    refreshZhaoLongBtnInfo(){
         //设置招龙按钮
        var longJieLabel = this.longJieLabelNode.getComponent(cc.Label);// 下面中间招龙的阶
        var longNeedMoenyLabel = this.longNeedMoenyLabelNode.getComponent(cc.Label);// 下面中间招龙需要的金钱
        var longIcon = this.zhaolongiconNode.getComponent(cc.Sprite);

        // var longId = 1000 + Number(cc.UserInfo.level);
        var maxlongData = this.getMaxLongData();
        this.maxlongData = maxlongData;
        if (maxlongData != null) {
            longJieLabel.string = "["+maxlongData.step +"阶]"
            cc.setLongIcon(maxlongData.iconName,longIcon);
        }
    
      
        var zNum = 0;
        var longNumData = cc.geLongNumDataById(maxlongData.id);
        if (longNumData != null) {
            zNum = longNumData.num ;//召唤次数
        }
        this.needJBNum = Number(zNum)  * maxlongData.cost1 + Math.floor(Number(zNum)  / 10) * maxlongData.cost2 + maxlongData.cost
        if (this.needJBNum >10000) {
            var alljy = this.needJBNum/10000;
           var jyStr = alljy.toFixed(2);
           longNeedMoenyLabel.string = jyStr + "万";
        }else{
            longNeedMoenyLabel.string = Number(this.needJBNum).toFixed(2);
        }
       

    },

    getMaxLongData(){
        //查找最大的阶数的龙
        var maxlongData = null;
        var list = cc.configMgr.configMap[cc.cfg_Name.longBaseData];
        for (const key in list) {
            if (list.hasOwnProperty(key)) {
                const element = list[key];
                if (element.type == 1 && element.step <= cc.UserInfo.level ) {
                    if (maxlongData == null) {
                        maxlongData = element;
                    }else{
                        if (maxlongData.step < element.step ) {
                            maxlongData = element;
                        }
                    }
                   
                }
            }
        }
        return maxlongData;
    },

 
    getNameRichStr(name,step){//获取名字的richText
        var str = "<color=#F30ACE>" + name + "</c><color=#46aa26>[" + step+ "阶]</color>";
        return str;
    },

    onClickFenHong(){//点击分红中心
        if (this.clickFlag == true) {
            return
        }
        this.clickFlag = true;
        var self = this;
        var loadPrefabsCallBack = function(perfab)
        {
            self.clickFlag = false;
            var script = perfab.getComponent('fenhongcenter');
           
        }

        cc.myShowView(cc.PanelID.YL_FENHONGCENTER,6,null,loadPrefabsCallBack);  
    },
    onClcikZhuanPan(){//转盘
        if (this.clickFlag == true) {
            return
        }
        this.clickFlag = true;
        var self = this;
        var loadPrefabsCallBack = function()
        {
            var perfab = cc.allViewMap[cc.PanelID.YL_ZHUANPAN];
            var script = perfab.getComponent('zhuanpan');
            self.clickFlag = false;
        }
        cc.myShowView(cc.PanelID.YL_ZHUANPAN,6,null,loadPrefabsCallBack);  
    },
    onClickGonglie(){//攻略
        this.clickFlag = true;
        var self = this;
        var loadPrefabsCallBack = function()
        {
            self.clickFlag = false;
        }
        cc.myShowView(cc.PanelID.YL_GONGLIE,6,null,loadPrefabsCallBack); 
    },
    onClickTuJian(){//图鉴
        this.clickFlag = true;
        var self = this;
        var loadPrefabsCallBack = function()
        {
            self.clickFlag = false;
        }
        cc.myShowView(cc.PanelID.YL_TUJIAN,6,null,loadPrefabsCallBack);  
        //cc.showCommTip("敬请期待");
         
    },
    onClickTongZhi(){//通知
        //cc.showCommTip("敬请期待");
        this.clickFlag = true;
        var self = this;
        var loadPrefabsCallBack = function()
        {
            self.clickFlag = false;
        }
        cc.myShowView(cc.PanelID.YL_WZACTIVE,7,null,loadPrefabsCallBack);
    },
    onClickTeSuMoLong(){//特殊魔龙
       // cc.showCommTip("敬请期待");
        if (this.clickFlag == true) {
            return
        }
        this.clickFlag = true;
        var self = this;
        var loadPrefabsCallBack = function()
        {
            self.clickFlag = false;
        }

        cc.myShowView(cc.PanelID.YL_TESUMOLONG,6,null,loadPrefabsCallBack);  
    },
    onClickTanSuo(){//探索
        if (this.clickFlag == true) {
            return
        }
        this.clickFlag = true;
        var self = this;
        var loadPrefabsCallBack = function()
        {
            self.clickFlag = false;
        }

        cc.myShowView(cc.PanelID.YL_TANSUO,6,null,loadPrefabsCallBack); 
    },
    onClickZhaoLong(){//招龙
        if (this.clickFlag == true) {
            return
        }
        this.clickFlag = true;
        var self = this;

        if (Number(cc.UserInfo.gold )< this.needJBNum ) {
            // cc.showCommTip("金元不足，召唤失败");
            self.onLackGoldPost()
            self.clickFlag = false;
        }else{
             //请求龙的数据列表
            var onPostCallBack  = function(self,ret){
                if (ret != -1) {
                    if (ret.status == "ok") {//成功
                        var data = ret.data
                        cc.log("招龙成功 ret= ",ret);
                        if (data.cost.diamond) {
                            cc.UserInfo.diamond = Number(cc.UserInfo.diamond) -  Number(data.cost.diamond);//消耗了多少金币
                        }
                        else if (data.cost.gold) {
                            cc.UserInfo.gold = Number.parseInt(cc.UserInfo.gold) -  Number.parseInt(data.cost.gold); 
                        }
                      
                        var itemData = {
                            id:data.long.id,
                            index:data.long.index,
                            level: data.long.level,
                            long_id: data.long.long_id,
                            stage:data.long.stage,
                            uid: data.long.uid,
                        }
                       
                       if(data.user_level)
                       {
                            cc.UserInfo.level = data.user_level;
                            self.refreshZhaoLongBtnInfo()
                       }
                        cc.UserInfo.addUserinfolong(itemData)
                       
                        cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示
                        self.addOneLong(itemData,true);//招呼了就增加一条龙
                        //更新列表次数的
                        var idx = -1;
                        var array = cc.UserInfo.long_num_List;
                        for (let index = 0; index < array.length; index++) {
                            const element = array[index];
                            if (Number(element.long_id) == Number(data.long.long_id)) {
                                idx = index;
                                break;
                            }
                        }
                        if (idx != -1) {
                            cc.UserInfo.long_num_List[idx].num = parseInt(data.long_num);
                        }else{
                            //此时是没找到
                            var longnumitem = {
                                long_id: data.long.long_id,
                                num:data.long_num
                            }
                            cc.UserInfo.long_num_List.push(longnumitem);
                        }

                        if (data.reward ) {
                            self.onShowHongBao(data.reward);
                        }
                        cc.UserInfo.guideClick = true;//第7引导点击招龙
                    }else{
                        cc.log("招龙失败 ret= ",ret);
                        cc.showCommTip(ret.msg);
                        
                    }
                    self.clickFlag = false;
                }
            };
            var psObjdata = {
                long_id:this.maxlongData.id,
            };
            var psdata = cc.JsonToPostStr(psObjdata);
            HttpHelper.httpPost(cc.UrlTable.url_long_summon,psdata,onPostCallBack,this);

        }
       
    },
    onClickLongDian(){//龙店
        if (this.clickFlag == true) {
            return
        }
        this.clickFlag = true;
        var self = this;

        var loadPrefabsCallBack = function()
        {
            self.clickFlag = false;
        }

        cc.myShowView(cc.PanelID.YL_LONGDIAN,1,null,loadPrefabsCallBack);  

    

    },
    onClickHuiShou(){//回收


        
    },
    onClickYouQing(){//友情卡

        if (this.clickFlag == true) {
            return
        }
        this.clickFlag = true;
        var self = this;
        var loadPrefabsCallBack = function()
        {
            self.clickFlag = false;
        }

        cc.myShowView(cc.PanelID.YL_YOUQING,10,null,loadPrefabsCallBack); 
    
    },

    onShowHongBao(reward)//显示红包
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
    onShowAllLong(){
        var array = cc.UserInfo.longList;
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            this.addOneLong(element,false);
        }
    },
    addOneLong(longdata,iszhao){//增加一条龙
      
        var pos = this.longPosList[Number(longdata.index)-1];
        // cc.log("=========xxxxx",this.longPosList,longdata.index,pos);
        var item = cc.instantiate(this.long_prefab);
        item.zIndex = Math.floor(Number(longdata.index)/4);
        item.setPosition(pos.x,pos.y);
        this.ylpage.addChild(item);
        var script = item.getComponent('longitem');
        script.setLongData(longdata,this,iszhao);
        this.longNodeList.push(item);//保存起来
    },

    setLongShowMoney(id,num)
    {
        var longScript= null
        for (let index = 0; index < this.longNodeList.length; index++) {
            const longNode = this.longNodeList[index];
            var script = longNode.getComponent('longitem');
            if (script.getId() == Number(id)) {
                longScript = script;
                break;
            }
        }
        //cc.log("==========id,num==",id,num);
        if (longScript != null) {
            longScript.showGetGold(num);
        }

    },

    onGetLongGold()//显示获得金币
    {
       
        //请求龙的数据列表
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                //cc.log("url_long_get_gold ret:",ret)
                if (ret.status == "ok") {//成功
                    
                    var data = ret.data;
                    cc.UserInfo.gold =  Number.parseInt(cc.UserInfo.gold) +  Number.parseInt(data.add_gold);
                    cc.refreshMoneyShow();//刷新显示
                    //显示龙冒金币的
                    var array = data.golds;
                    for (let i = 0; i < array.length; i++) {
                        const element = array[i];
                        self.setLongShowMoney(Number(element.id),Number(element.num))
                    }
                }
            }
        };
        var psObjdata = {
          gold: cc.UserInfo.gold,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_long_get_gold,psdata,onPostCallBack,this);


    },

    update (dt) {
        this.countTime =  this.countTime +dt;
        if ( this.countTime >= 8.0) {
            this.countTime = 0;
         
            this.onGetLongGold();
        }
        this.countPostLevelTime = this.countPostLevelTime + dt;
        if (this.countPostLevelTime >=41) {
            this.countPostLevelTime = 0;
            this.onPostlevelmsgData();
        }

       
     },

     playHeTiEffect(posidx,call)//显示合体特效的
     {
        var itemeff = cc.instantiate(this.hetieff_prefab);
       
        var pos = this.longPosList[Number(posidx)-1];
        itemeff.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.ylpage.addChild(itemeff,10);
        
         var script = itemeff.getComponent('hetieffect');
         script.setparentCallBack(call);

     },
     

  
    onClickXianJin()
    {
        // if (Number(cc.UserInfo.ident) != 1) {//0 未提交身份证信息 1认证
        //     cc.showCommTip("您还没实名验证");
        //     return
        // }

        // if (Number.parseInt(cc.UserInfo.level) < this.noGetRewardLv) {
        //     cc.showCommTip("等级未达到");
        //     return
        // }
         //请求等级奖励
         var self = this;
         var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                //cc.log("url_long_level_reward ret:",ret)
                if (ret.status == "ok") {//成功
                    
                    var data = ret.data;
                    self.onShowGetLevelReward(data.reward)
                    cc.UserInfo.level_reward[self.noGetRewardLv] = "1";
                    self.onRefreshLevelReward();
                    

                }else{
                    cc.showCommTip(ret.msg);
                }
            }
        };
        var psObjdata = {
            level:self.noGetRewardLv,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_long_level_reward,psdata,onPostCallBack,this);

    },
    onRefreshLevelReward()
    {
        var lvArr = {3:1,7:2,11:3,15:4};
        for (let index = 1; index <= 4; index++) {
            var btnNode =  cc.UITools.findNode(this.ggNode,"levelrewardBtn"+index);
            btnNode.active = false;
            var Btn = btnNode.getComponent(cc.Button);
            Btn.interactable = false;
        }
        //level_reward: {3: "0", 7: "0", 11: "0", 15: "0"}
        var keyList = [3,7,11,15];
        var noGetRewardLv = 3;
        for (let i = 0; i < keyList.length; i++) {
            var k =  keyList[i];
            var val = cc.UserInfo.level_reward[k];
            if (Number.parseInt(val) == 0) {
                noGetRewardLv  = k;
                break;
            }
        }
        this.noGetRewardLv = noGetRewardLv;
       
        // if (Number.parseInt(cc.UserInfo.level) >= noGetRewardLv) {
            //显示最近一个没领取的按钮
                                                          
            var btnNode1 =  cc.UITools.findNode(this.ggNode,"levelrewardBtn"+lvArr[noGetRewardLv]);
            btnNode1.active = true;
            var btn = btnNode1.getComponent(cc.Button);
            btn.interactable = true;
        //}
    },

    onShowGetLevelReward(reward)//显示红包
    {
        cc.UserInfo.rmb = Number.parseFloat(cc.UserInfo.rmb) + Number.parseFloat(reward.rmb);
        cc.refreshMoneyShow();
        var self = this;
        var loadPrefabsCallBack = function()
        {
            var perfab = cc.allViewMap[cc.PanelID.YL_GETHONGBAODETAIL];
            var script = perfab.getComponent('gethongbaodetail');
            script.onSetGetMoney(reward);

        }

        cc.myShowView(cc.PanelID.YL_GETHONGBAODETAIL,10,null,loadPrefabsCallBack);  

    },

 


    onPostlevelmsgData()
    {
      //请求邀请信息
        var onPostCallBack  = function(self,ret){
          if (ret != -1) {
              if (ret.status == "ok") {//成功
    
                 // cc.log("onPostlevelmsgData ret= ",ret,self.lvMSgList);
                  var data = ret.data;
                  
                  for (let index = data.length-1; index >=0; index--) {
                      const element = data[index];
                      //  cc.log(index,element)
                      self.lvMSgList.push(element); // 
                  }
                // cc.log(self.lvMSgList);
              }
          }
      };
      var psObjdata = {
         maxid:this.maxId,
      };
      var psdata = cc.JsonToPostStr(psObjdata);
      HttpHelper.httpPost(cc.UrlTable.url_yl_get_level_msg,psdata,onPostCallBack,this);

    },

    showGongGao(){//显示公告
      //cc.log("cc.UserInfo.messageList: ",cc.UserInfo.messageList.length);
      
      var self = this;
      var richText = this.gonggaoRichNode.getComponent(cc.RichText);
      var itemdata =  this.lvMSgList[this.showMsIdx];
      // cc.log("==1======showGongGao ",this.showMsIdx,itemdata)
      richText.string = this.getGgRichString(itemdata);
      var x =  this.gonggaoRichNode.x;
      
     
      this.gonggaoRichNode.y = -32
      var callback = function(){
          self.nextShowGG();
      }
      var seq = cc.sequence(cc.moveTo(1,cc.v2(x, 0)),cc.delayTime(1.5) ,cc.moveTo(1.0,cc.v2(x, 50)),cc.callFunc(callback));
      this.gonggaoRichNode.runAction(seq);
     
      if (itemdata.name != null) {
         this.lvMSgList.splice(this.showMsIdx,1);
      }else{
        this.showMsIdx = this.showMsIdx +1;
      }
      if (this.showMsIdx >= this.lvMSgList.length) {
        this.showMsIdx = 0;
      }
      //cc.log("==2======showGongGao ",this.showMsIdx)
     
  },

  nextShowGG(){
      var self = this;
      var callback = function(){
          self.showGongGao();
      }
      var seq = cc.sequence(cc.delayTime(1), cc.callFunc(callback));
      this.gonggaoRichNode.runAction(seq);
  },
  getGgRichString(itemdata){
   
            //	1:金元，2:人民币元
        if (itemdata == null) {
          return "";
        }
        var text = "";
        if (itemdata.name != null) {
            //{id: "2", name: "海哥", level: "7", rmb: "3"}
            text = "<color=#ffffff>祝贺</color><color=#03fdfa>" + itemdata.name + "  </c><color=#ffffff>达成</c>";
            text = text + "<color=#00ff00>"+itemdata.level+"</color><color=#ffffff>阶魔龙，成功领取</color>";
            text = text + "<color=#30fe00>"+itemdata.rmb+"</color><color=#ffffff>元现金(可提现)</color>";
        }
        else{
            var text = "<color=#ffffff>" + itemdata.desc + "  </c><color=#ffffff>";
        }
      
        
        return text;
    },
    setSystemMsg()
    {
        this.lvMSgList = [
            {desc:"将两个同阶的魔龙，拖到一起即可合体。"},
            {desc:"魔龙合体必得奖励：现金或分红卡等物品。"},
            {desc:"邀请好友数量越多，收益就越高，月入万元。"},
            {desc:"拥有分红卡，每天躺着开心数钱，下一个幸运儿就是您。"},
            {desc:"边养龙边偷红包，每天收益爽歪歪。。"},
            {desc:"魔龙每8秒会产出一次金币，必须要招满哟。"},
            {desc:"猜一猜最高可得1888元超级现金，您，触手可得。"},
        ]
    },

    //缺少金币看视频
    onLackGoldPost()
    {   
        var self = this;

        if (self.isPostData == false) {
            return
        }
        cc.UserInfo.showVideoPage = this;
      
        self.isPostData = false;
         var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log(" yl LackGoldPost 能获得多少金币:",ret)
                if (ret.status == "ok") {//成功
                    var data = ret.data;
                    var onClickCallBack = function(d)//点击看视频回调
                    {
                        if (d == 1) {
                            if ( Number.parseInt(cc.UserInfo.adv_times) <=0) {
                                cc.showCommTip("观看次数不足");
                            }
                            else{  //请求打开视频
                                self.showRewardVideo("2"); 
                            }
                        }
                    }
                    var loadPrefabsCallBack = function()
                    {
                        var mperfab = cc.allViewMap[cc.PanelID.YL_POPUPPAGE];
                        var mscript = mperfab.getComponent('popuppage');
                        mscript.onShowUi(cc.popviewType.lackgold,data.adv_gold,onClickCallBack);
                    }
                     cc.myShowView(cc.PanelID.YL_POPUPPAGE,8,null,loadPrefabsCallBack); 
                     self.isPostData = true;
                }
            }
        };
        var psObjdata = {
          
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_long_get_adv_gold,psdata,onPostCallBack,this);
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
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("onFinishGetReward    ret:",ret)
                if (ret.status == "ok") {//成功
                    var data = ret.data;
                    cc.UserInfo.adv_times =  Number.parseInt(data.adv_times)
                    var goldnum = data.reward.gold;
                    cc.UserInfo.gold =  Number(cc.UserInfo.gold) + Number(goldnum);//金币的
                    cc.refreshMoneyShow();//刷显示
                    var loadPrefabsCallBack = function()
                    {
                        var mperfab = cc.allViewMap[cc.PanelID.YL_POPUPPAGE];
                        var mscript = mperfab.getComponent('popuppage');
                        mscript.onShowUi(cc.popviewType.getgold,goldnum,null);
                    }
                    cc.myShowView(cc.PanelID.YL_POPUPPAGE,7,null,loadPrefabsCallBack); 
                    
                   var rand = Math.random(100);
                   if(rand %2 == 0)
                   {
                       self.showIAD();//显示插屏
                   }
                }
            }
        };
        var psObjdata = {
          
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_long_adv_gold,psdata,onPostCallBack,this);
    },

   

    onClickHeChengFenHong(event, customEventData)
    {
        var self = this;
        var node = event.target;
        var curButton = node.getComponent(cc.Button);
        curButton.interactable = false;
        var loadPrefabsCallBack = function()
        {
            curButton.interactable = true;
            var perfab = cc.allViewMap[cc.PanelID.YL_TESU_HECHENG];
            var script = perfab.getComponent('hecheng');
            script.setParentScript(self);
            
        }
        cc.myShowView(cc.PanelID.YL_TESU_HECHENG,7,null,loadPrefabsCallBack);  
    },

    onClickGongLieGuiZe(event, customEventData)
    {
        var node = event.target;
        var curButton = node.getComponent(cc.Button);
        curButton.interactable = false;
        var loadPrefabsCallBack = function()
        {
            curButton.interactable = true;
            
        }
        cc.myShowView(cc.PanelID.YL_BONUSCARRULE,7,null,loadPrefabsCallBack);

    },
    onClickBigFenHongKa(event, customEventData)
    {

        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("onClickBigFenHongKa    ret:",ret)
                if (ret.status == "ok") {//成功
                    var data = ret.data;
                    if (data.reward != null &&data.reward.items!= null ) {
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
                        self.onShowGetReward(reward[0],reward[1]);//显示获得物品
                     }
                }
                else{
                    cc.showCommTip(ret.msg);
                }
            }
        };
        var psObjdata = {
          
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_get_premanet_card,psdata,onPostCallBack,this);
    },
    onShowGetReward(itemId,num)
    {

          //显示获得物品
          var loadPrefabsCallBack = function()
          {
           
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
    },


    showIAD()
    {
  
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showIAD', '()V');
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
        
        }
  
    },

    updateOutGetGoldSpeed()
    {   
        var speed = 0;
        var array = cc.UserInfo.longList;
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            var outData = cc.configMgr.getLongUpOutItemData( element.long_id, element.level);
            speed = speed + outData.outmoney
        }
        speed =  Number.parseInt(speed/8);
        var outGetGoldLable = this.outGetGoldLabl.getComponent(cc.Label);//金元
        outGetGoldLable.string = speed+"/秒"
    },

});
