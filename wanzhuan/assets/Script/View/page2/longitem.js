
cc.Class({
    extends: cc.Component,

    properties: {
   
        longIconNode:{//龙的icon
            default: null,
            type: cc.Node
        },
        target: cc.Node,
        tipLabelNode:cc.Node,
        index:-1,//位置的indx
        longData:null,
        parentScript:null,
        levelLabelNode:cc.Node,
        jieLableNode:cc.Node,
        goldLabelNode:cc.Node,

        getgoldAudioClip: {
            type: cc.AudioSource,
            default: null
        },
        levelUpAudioClip: {
            type: cc.AudioSource,
            default: null
        },
        zhaoChuAudioClip: {
            type: cc.AudioSource,
            default: null
        },
        tipBgNode:cc.Node,
        current:null,
       
    },

//     id: "30"
// index: "1"
// level: "0"
// long_id: "1001"
// stage: "1"
// uid: "15"
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.maxdist = 50;
        this.showLabel =  this.tipLabelNode.getComponent(cc.Label);
        this.goldLabel =  this.goldLabelNode.getComponent(cc.Label);
        this._oldPosition = this.node.position;
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
        this.isClick = true;//是否是点击还是移动
        this.isPostData = false;
      
    },

   
    setLongData(data,ps,iszhao){//传值进来
        this.longData = data;
        this.parentScript = ps;
        this.jieLable =  this.jieLableNode.getComponent(cc.Label);
        this.levelLabel =  this.levelLabelNode.getComponent(cc.Label);
        this.onFreshLongLevelOrJie();//更新显示等级或者阶位

        var longIcon = this.longIconNode.getComponent(cc.Sprite);
        var longId =  Number( this.longData.long_id);
        var baseLongdata = cc.configMgr.configMap[cc.cfg_Name.longBaseData][longId];
        this.baseLongdata = baseLongdata;
        cc.setLongIcon(baseLongdata.iconName,longIcon);
        //招出来的时候
        if (iszhao == true) {
            this.zhaoChuAudioClip.play();
        }
       
    },

    
    onFreshLongLevelOrJie()
    {
        this.jieLable.string = this.longData.stage + "阶";
        this.levelLabel.string =  this.longData.level+"级";
        var fushuScript = cc.getPageSriptByIndx(1);
        fushuScript.onRefreshDataShow();//刷新显示等级
    },

    getLongType(){//获取龙的类型
        
        return this.baseLongdata.type;
    },
    getLongData(){
       return  this.longData;
    },

    getLongPosIndx(){//
        return Number(this.longData.index);
    },
    setLongPosIndx(posidx)
    {
        this.longData.index = posidx;
        var idx = cc.UserInfo.getLongListIndxByid(this.longData.id);
        cc.UserInfo.longList[idx].index = Number(posidx);//wiz改变
    },

    getLongId(){
        return Number(this.longData.long_id);
    },
    getId(){
        return Number(this.longData.id);
    },
    getLongLevel(){
        return Number(this.longData.level);
    },
    getLongStage(){
        return Number(this.longData.stage);
    },
   
    _onTouchBegin(touchEvent) {
        
       // this._oldPosition = this.node.position;
       var posidx =  this.getLongPosIndx();
        this.startLocation = touchEvent.getLocation();
        var pos = this.parentScript.longPosList[posidx-1];
         this._oldPosition = pos;
      
       // cc.log(" this._oldPosition =", this._oldPosition,"   this.startLocation= ",this.startLocation,this.node.zIndex);
        if (this.isPostData == true ) {
            return;
        }
        this.isClick = true;//是否是点击还是移动
        this.node.zIndex = this.node.zIndex + 5;
    },

    _onTouchMove(touchEvent) {
        let location = touchEvent.getLocation();
        let delta = touchEvent.getDelta();
        var x = location.x - this.startLocation.x;
        var y = location.y - this.startLocation.y;
        var l = Math.sqrt(x*x + y *y);
        // cc.log(x,y,l);
      
        if (l > 5) {
            this.isClick = false;//是否是点击还是移动
        }
        if ( this.isClick == false) {
            this.node.setPosition(this.node.position.x + delta.x,this.node.position.y + delta.y);
        }
        //this.node.position.y = this.node.position.y + y;
       // this.node.position = this.node.parent.convertToNodeSpaceAR(location);
    },

    _onTouchEnd(touchEvent) {
        this.node.zIndex = 1;
      //  cc.log("=========_onTouchEnd 移动",this.isClick);
        if (this.isClick == true) {
           // cc.log("=========_onTouchEnd 移动");
             //不在矩形中，还原节点位置    
            this.node.position = this._oldPosition;
            this.onClickLong();//点击
        }else{
           // cc.log("=========_onTouchEnd 移动");
             var re = this.onEndMoveDeal();
             if (re == -1) {
                this.node.position = this._oldPosition;
                cc.log("没拖到对应位置");
             }
        }
    },

    _onTouchCancel(touchEvent){
        this.node.zIndex = 1;
        this.isClick = false;//是否是点击还是移动
        this.node.position = this._oldPosition;
        this.isPostData = false;
       //// cc.log("没拖到对应位置_onTouchCancel");
    },

    showTip(str){
        this.tipBgNode.active = true;
        this.showLabel.string = str;
        this.tipLabelNode.stopAllActions()
       
        var showCallBack = function(self){
            self.tipBgNode.active = false;
        }
        this.conShowTipAction(this.tipBgNode,showCallBack,this);
    },

   conShowTipAction (n,callFunc,self){
       
        var fadein = cc.fadeIn(0.01);
        var delayAct = cc.delayTime(0.5);
        var fadeAct = cc.fadeOut(0.01);
       
        var action = cc.sequence(fadein,delayAct,fadeAct,cc.callFunc(function(){
            if (callFunc) {
                callFunc(self);
            }
            },self)
        );
    
        n.runAction(action)
    },


    onClickLong(){

        if (this.getLongLevel() > -1 ) {
            return;
        }

        if (this.getLongLevel() >= cc.MAX_LONG_LEVEL) {
            // cc.showCommTip("已满级,请尽快合体哟!")
            return;
        }
        var uoData = cc.configMgr.getLongUpOutItemData( this.getLongId(), this.getLongLevel()+1);
        var needMoney = uoData.needmoney;
      
        //cc.log("cc.UserInfo.gold,needMoney ",cc.UserInfo.gold,needMoney)
        if (  Number(cc.UserInfo.gold) < Number(needMoney) ) {//金币不足
                this.onLackGoldPost();

            return;
        }
      
           //请求龙的数据列表
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                //cc.log("请求龙的升级 ret1= ",ret);
                if (ret.status == "ok") {//成功
                    var data = ret.data
                    //cc.log("请求龙的升级 ret= ",ret);
                    if (data.cost != null && data.cost.gold != null) {
                        cc.UserInfo.gold = parseInt(cc.UserInfo.gold) -  parseInt(data.cost.gold);//消耗了多少金币
                        if (Number.parseInt(data.level) >= self.longData.level ) {
                            self.longData.level =   Number.parseInt(data.level);//等级改变
                        }
                       
                       
                        cc.UserInfo.up_num = data.up_num;//显示有多少个的
                        
                      
                        if ( Number(data.user_level) != Number(cc.UserInfo.level)) {//解锁龙的阶位获得东西的
                            
                            var loadPrefabsCallBack = function()
                            {
                                
                                var mperfab = cc.allViewMap[cc.PanelID.YL_POPUPPAGE];
                                var mscript = mperfab.getComponent('popuppage');
                                mscript.onShowUi(cc.popviewType.jiesuolong,Number(data.user_level),null);
                            }
                            cc.myShowView(cc.PanelID.YL_POPUPPAGE,3,null,loadPrefabsCallBack); 
                            cc.UserInfo.level = Number(data.user_level)
                        }
                        else{
                           
                        }
                        var idx = cc.UserInfo.getLongListIndxByid(self.longData.id);
                        cc.UserInfo.longList[idx].level = Number(data.level);//等级改变
                        
                        self.onFreshLongLevelOrJie();//更新显示等级或者阶位
                        if ( data.add_hongbao_list != null && data.add_hongbao_list.length >= 1) {
                            var hbItem =   data.add_hongbao_list[0];
                            cc.UserInfo.hb_list.push(hbItem); //福树界面update
                        }

                    }else{ 
                        
                    }
                    
                    cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示
                    self.tipLabelNode.color = cc.greenColor;

                    //self.showTip("升级成功");
                    cc.showCommTip("升级成功");
                   
                    cc.UserInfo.guideClick = true;//第8，9 升级龙

                     //播放获得升级的声音
                    self.levelUpAudioClip.play();
                }else{
                   
                    self.tipLabelNode.color = cc.redColor;
                    // cc.log("ret= ",ret);
                    if (ret.msg == "金币不足") {
                        self.onLackGoldPost();
                    }
                    else{
                        cc.showCommTip(ret.msg);
                    }
                   
                }
                self.isPostData = false;
            }
        };
        var psObjdata = {
            id:this.longData.id,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        
        HttpHelper.httpPost(cc.UrlTable.url_long_up_level,psdata,onPostCallBack,this);
        this.isPostData = true;

    },

    onEndMoveDeal(){
        var r = -1;
        var array = this.parentScript.longNodeList
        var  isSwap = false;
        for (let index = 0; index < array.length; index++) { //看看是不是要交换位置还是合体
            const  longNode = array[index];
            var mscript = longNode.getComponent('longitem');
            if (mscript.getId() != this.getId() ) { //自己不等于自己
                var x = longNode.x - this.node.position.x;
                var y = longNode.y - this.node.position.y;
                var dist = Math.sqrt(x*x + y *y);
               
                if (dist < this.maxdist) {
                    this.onDealDragWitSwapOrHeTi(longNode,mscript);
                    isSwap = true;
                    r = 0;
                    break;
                }
            }
        }

        if (isSwap == false) {//看看是不是要换位置
            var longPosList = this.parentScript.longPosList
            for (let i = 0; i < longPosList.length; i++) {
                const pos = longPosList[i];
                var x = pos.x - this.node.x;
                var y = pos.y - this.node.y;
                var dist = Math.sqrt(x*x + y *y);
                if (dist < this.maxdist) {
                    this.onChangePosPost(i+1,pos);
                    r = 0;
                    break;
                }
                
            }
        }

        //看看是不是拖到回收站
        var x = this.parentScript.huishouBtnNode.x - this.node.x;
        var y =this.parentScript.huishouBtnNode.y - this.node.y;
        var dist = Math.sqrt(x*x + y *y);
        cc.log("===================dist",dist)
        if (dist < this.maxdist) {
            this.dragToRecover();
            r = 0;
        }

        return r;
    },

    onDealDragWitSwapOrHeTi(targetNode,targetScript)
    {
        //同阶 ，同满级27级 同龙id
        if (this.getLongLevel() >= cc.MAX_LONG_LEVEL &&  targetScript.getLongLevel() >= cc.MAX_LONG_LEVEL) {
            if (this.getLongStage() == targetScript.getLongStage() && this.getLongId() == targetScript.getLongId()) {
                var type = this.getLongType();
                var self = this;
                var palyEffCallBakck = function()
                {
                    self.onHeTiPost(targetNode,targetScript);//合体的请求
                }
                if (Number(type) != 1) {//特殊龙的要显示合体盘
                    self.onHeTiPost(targetNode,targetScript);//合体的请求
                }else{
                    self.parentScript.playHeTiEffect(self.getLongPosIndx(),palyEffCallBakck)
                }
                

            }
            else
            {
                this.onSwapPosPost(targetNode,targetScript)//交换位置的请求
            }
        }
        else{
            this.onSwapPosPost(targetNode,targetScript)//交换位置的请求
        }
    },

    onSwapPosPost(targetNode,targetScript)//交换位置的请求
    {
          //请求龙的数据列表
          var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                  
                  // cc.log("请求交换位置结果",ret);
                    var pos1 = cc.v2(self._oldPosition.x,self._oldPosition.y)
                    var pos2 = cc.v2(targetNode.x,targetNode.y)
                   
                    self.node.position = pos2;
                    targetNode.position = pos1;
                   // targetNode.runAction(cc.moveTo(0.1,pos1))
                    //交换index
                    var index1 = self.getLongPosIndx();
                    var index2 = targetScript.getLongPosIndx();
                    
                
                    self.setLongPosIndx(index2);
                    targetScript.setLongPosIndx(index1)
                }
                else{
                    self.onMoveBack();
                    targetScript.onMoveBack();
                }
                self.isPostData = false;
            }
        };
        var psObjdata = {
            id1:this.getId(),
            id2:targetScript.getId(),
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_long_swap_index,psdata,onPostCallBack,this);
        this.isPostData = true;
    },

 
    onHeTiPost(targetNode,targetScript)//合体的请求
    {

        var type = this.getLongType();
        if (Number(type) != 1) {
            var self = this;
            var loadPrefabsCallBack = function()
            {
                var perfab = cc.allViewMap[cc.PanelID.YL_HETI];
                var script = perfab.getComponent('heti');
                script.onSetData(type,self,targetScript);

               
            }
            cc.myShowView(cc.PanelID.YL_HETI,2,null,loadPrefabsCallBack);

            return;
        }

        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("普通合体====",ret);
                if (ret.status == "ok") {//成功,弹出获得物品
                    var data = ret.data;
                    var itemsList = data.reward.items;
                    for (let i= 0; i < itemsList.length; i++) {
                        var element = itemsList[i];
                        var itemData = cc.configMgr.getItemDataById(element[0]);
                        // 奖励ID所对应的类型=3，就是红包。
                        // 奖励ID所对应的类型=2，就是道具。
                        // 奖励ID所对应的类型=4，就是金币。
                        if (itemData.type == 3 ) {
                            cc.UserInfo.rmb = Number.parseFloat(cc.UserInfo.rmb) + Number.parseFloat(element[1])
                        }else if (itemData.type == 2) {
                            cc.UserInfo.addItems(element[0],element[1]);
                        }
                        else if (itemData.type == 4) {
                            cc.UserInfo.gold = Number.parseInt(cc.UserInfo.gold) + Number.parseInt(element[1]);
                        }
                    }
                    cc.UserInfo.guideClick = true;//拖动2条龙合成
                    //显示获得物品
                    var loadPrefabsCallBack = function()
                    {
                        var mperfab = cc.allViewMap[cc.PanelID.YL_POPUPPAGE];
                        var mscript = mperfab.getComponent('popuppage');
                        var itemData = cc.configMgr.getItemDataById(itemsList[0][0]);
                        var ty = cc.itemTypeTransformPopType(itemData.type);
                        var dd  = itemsList[0][0];
                        if (ty == cc.popviewType.getgold ) {
                            dd = itemsList[0][1];
                        }
                        if (ty == cc.popviewType.getrmb) {
                            dd =  itemsList[0];
                        }
                        mscript.onShowUi(ty,dd,null);
                       
                    }
                    cc.myShowView(cc.PanelID.YL_POPUPPAGE,8,null,loadPrefabsCallBack); 
                    
                    cc.removeLongItemInPage2ById(self.getId());
                    cc.removeLongItemInPage2ById(targetScript.getId());
                    cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示
                }
                else{
                    self.onMoveBack();
                    targetScript.onMoveBack();
                }

                self.isPostData = false;
            }
        };
        var psObjdata = {
            id1:this.getId(),
            id2:targetScript.getId(),
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_long_merge,psdata,onPostCallBack,this);
        this.isPostData = true;
    },

    onChangePosPost(posidx,targetPos)//换位置
    {
        //请求龙的数据列表
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                  cc.log("换位置====",ret);
                    self.node.position = targetPos;
                    
                    self.setLongPosIndx(posidx);
                }
                else{
                    self.onMoveBack();
                }
                self.isPostData = false;
            }
        };
        var psObjdata = {
            id:this.getId(),
            index:posidx ,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_long_change_index,psdata,onPostCallBack,this);
        this.isPostData = true;
    },
    dragToRecover()//回收的
    {   var self = this;
        var allmoney = 0;
        //累加多少钱
        var longid = this.getLongId();
        var lv = this.getLongLevel();
        var list = cc.configMgr.configMap[cc.cfg_Name.longUpOut_data];
        for (const key in list) {
            if (list.hasOwnProperty(key)) {
                const element = list[key];
                if (Number(element.longid) == Number(longid) && Number(element.level) <= Number(lv)  ) {
                    allmoney = allmoney + element.needmoney;
                }
            }
        }

        var basedata = cc.configMgr.getLongBaseDataById(longid);
        if (basedata.type == 1) {
            allmoney = allmoney *0.20;
        }else{
            allmoney = allmoney *0.40;
        }
      
        var  onClickCallBack = function(ret)
        {
            if (ret == 1) {//确认，请求信息去
                self.onPostRecover(self);//请求信息
            }
            else if (ret == 0) {//取消
                 self.node.position = self._oldPosition;//位置还原
                //self.node.runAction(cc.moveTo(0.1,self._oldPosition));//位置还原
            }
        }
        //式：当前等级所花费的总金币*25%。
        var loadPrefabsCallBack = function()
        {
            var mperfab = cc.allViewMap[cc.PanelID.YL_POPUPPAGE];
            var mscript = mperfab.getComponent('popuppage');
            mscript.onShowUi(cc.popviewType.huishoumolong,allmoney,onClickCallBack);
        }
        cc.myShowView(cc.PanelID.YL_POPUPPAGE,3,null,loadPrefabsCallBack); 

    },
    onPostRecover(self)//请求回收
    {
         //请求龙的数据列表
         var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                    var data = ret.data;
                    if (data.reward != null &&data.reward.gold != null ) {
                        cc.UserInfo.gold =  Number(cc.UserInfo.gold) +  Number(data.reward.gold);
                    }
                    cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示
                    cc.removeLongItemInPage2ById(self.getId());//养龙界面删除龙的
                    // cc.log(self.parentScript.longNodeList)
                   
                }
                else{
                    self.onMoveBack();
                }
                self.isPostData = false;
            }
        };
        var psObjdata = {
            id:this.getId(),
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_long_recover,psdata,onPostCallBack,this);
        this.isPostData = true;
    },


    onLackGoldPost()
    {
        
        cc.UserInfo.showVideoPage = this;
        var self = this;
        self.isPostData = false;
      
         var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("onLackGoldPost 能获得多少金币:",ret)
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

        //cc.showCommTip("金币不足");
         
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
                cc.log("onLackGoldPost ret:",ret)
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

                   
                }

            
            }
        };
        var psObjdata = {
          
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_long_adv_gold,psdata,onPostCallBack,this);
    },


    showGetGold(goldNum)// 显示获得金币
    {
        this.goldLabelNode.color = cc.greenColor;
        this.goldLabelNode.stopAllActions()
        var showCallBack = function(self){
           
        }
        cc.moneyShowAction( this.goldLabelNode,"+"+goldNum,showCallBack,this);

        //播放获得金币的声音
        
        // this.current = cc.audioEngine.play(this.getgoldAudioClip, false, 1);
        //this.getgoldAudioClip.play();
        //动一下
        var t = 0.4;
        var len = 6;
        var act1 = cc.moveBy(t,cc.v2(0,len));
        var act2 = cc.moveBy(t,cc.v2(0,-len));
        var action = cc.sequence(act1,act2);
        this.node.runAction(action);

    },
    
    onDestroy: function () {
        //  this.getgoldAudioClip.destory();
        //  this.levelUpAudioClip.destory();
        //  this.zhaoChuAudioClip.destory();
     
    },
    onMoveBack()
    {   var posidx =  this.getLongPosIndx();
        var pos = this.parentScript.longPosList[posidx-1];
        //this.node.position =   this._oldPosition;
        this.node.position = pos;
        //this.node.runAction(cc.moveTo(0.1,pos));//位置还原
    }

    // update (dt) {},
});
