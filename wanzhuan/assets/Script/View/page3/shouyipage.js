
cc.Class({
    extends: cc.Component,

    properties: {
      
        maskLayoutNode:cc.Node,
        topLayoutNode:cc.Node,
        shouyiBgNode:cc.Node,
        todayAllProfitLabelNode:cc.Node,//今日总收益
        level1_num_label_Node:cc.Node,//	[1]级玩赚队友数
        level2_num_label_Node:cc.Node,//[2]级玩赚队友数
        level1_merge_label_Node:cc.Node,//	1级合体产出收益
        level1_permanent_tmp_label_Node:cc.Node,//1级永久分红卡收益+ 1级临时分红卡收益
     
        level2_merge_label_Node:cc.Node,//	2级合体产出收益
        level2_permanent_tmp_label_Node:cc.Node,//2级永久分红卡收益 + 2级临时分红卡收益
        
        rate_label_node:cc.Node,//领取临时分红卡百分比累计
        login_label_node:cc.Node,//当天是否登陆
        merge_label_node:cc.Node,//当天合体次数
        invite_label_node:cc.Node,//邀请队友的

        tmp_card_btn_node:cc.Node,
        yanzheng_btn_node:cc.Node,
        guanzhuwechat_btn_node:cc.Node,

        login_finish_node:cc.Node,
        merge_finish_node:cc.Node,
        invite_finish_node:cc.Node,
        yanzhengfinishNode:cc.Node,//验证已经完成
        gzwechatfinishNode:cc.Node,//关注已经完成

       

    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.4;
            }
            
            // this.topLayoutNode.y = this.topLayoutNode.y + cc.iphone_off_Y*2.0;
            this.shouyiBgNode.y = this.shouyiBgNode.y + cc.iphone_off_Y*2.0;
          
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*6);
        }

     },

    start () {
        
        
        this.todayAllProfitLabel = this.todayAllProfitLabelNode.getComponent(cc.Label);//今日总收益
        this.level1_num_label = this.level1_num_label_Node.getComponent(cc.Label);//[1]级玩赚队友数
        this.level2_num_label = this.level2_num_label_Node.getComponent(cc.Label);//[2]级玩赚队友数
        this.level1_merge_label = this.level1_merge_label_Node.getComponent(cc.Label);//	1级合体产出收益
        this.level1_permanent_tmp_label = this.level1_permanent_tmp_label_Node.getComponent(cc.Label);//1级永久分红卡收益+ 1级临时分红卡收益
        this.level2_merge_label = this.level2_merge_label_Node.getComponent(cc.Label);//	2级合体产出收益
        this.level2_permanent_tmp_label = this.level2_permanent_tmp_label_Node.getComponent(cc.Label);//2级永久分红卡收益 + 2级临时分红卡收益

        this.rate_label = this.rate_label_node.getComponent(cc.Label);//领取临时分红卡百分比累计
        this.login_label = this.login_label_node.getComponent(cc.Label);//当天是否登陆
        this.merge_label = this.merge_label_node.getComponent(cc.Label);//当天合体次数

        this.rate = 0;
      

        if (cc.UserInfo.follow_mp != null) {
            if (cc.UserInfo.follow_mp == 1) {
               this.gzwechatfinishNode.active = true; 
               this.guanzhuwechat_btn_node.active = false;
            } 
        }
        if (cc.UserInfo.ident_gift != null) {
            if (cc.UserInfo.ident_gift == 1) {
                this.yanzhengfinishNode.active = true; 
                this.yanzheng_btn_node.active = false;
            } 
        }

        this.onGetPostData(); //请求收益中心的数据列表
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
        this.level1_num_label.string = data.level1_num;//[1]级玩赚队友数
        this.level2_num_label.string = data.level2_num;//[2]级玩赚队友数
        this.level1_merge_label.string = data.level1_merge;//1级合体产出收益
       
        this.level1_permanent_tmp_label.string = Number.parseFloat( data.level1_card).toFixed(2);//1级永久分红卡收益+ 1级临时分红卡收益
        this.level2_merge_label.string = data.level2_merge;//2级合体产出收益

        this.level2_permanent_tmp_label.string = Number.parseFloat( data.level2_card).toFixed(2);//2级永久分红卡收益 + 2级临时分红卡收益

        this.todayAllProfitLabel.string =  Number.parseFloat(data.today_self_bonus).toFixed(2);//今日总收益

        //移到另外个页面去
        var scrpit = cc.getPageSriptByIndx(5);
        if (scrpit != null) {
            scrpit.setFenHongKaShow(data)
        }

    },

    onClickXuanChuan()//点击宣传的
    {
        

        var loadPrefabsCallBack = function()
        {
           
        }

        cc.myShowView(cc.PanelID.SY_SHAREWECHAT,12,null,loadPrefabsCallBack);  
    },
    onClickProfitLog()//点击历史收益
    {
        var loadPrefabsCallBack = function()
        {
           
        }

        cc.myShowView(cc.PanelID.SY_LOGPAGE,12,null,loadPrefabsCallBack);  
    },
    onClickGetTmpCard()//领取临时分红卡
    {
        // if (cc.UserInfo.syData != null &&  Number(cc.UserInfo.syData.rate) < 100.0) {
        //     cc.showCommTip("进度未满100%");
        // }
        // else{
            var onPostCallBack  = function(self,ret){
                if (ret != -1) {
                    cc.log("url_sy_get_tmp_card ret= ",ret);
                    if (ret.status == "ok") {//成功
                      
                        cc.showCommTip("领取成功");
                        // cc.UserInfo.bonus_data.
                        cc.UserInfo.bonus_data.self_tmp_num = Number.parseInt( cc.UserInfo.bonus_data.self_tmp_num) + 1;
                        self.rate  = Number.parseFloat(ret.data.rate).toFixed(2);
                        self.rate_label.string = self.rate +"%";//领取临时分红卡百分比累计

                    }else{
                        cc.showCommTip(ret.msg);
                    }
                    cc.myHideView(cc.PanelID.LOADING_PAGE)
                }
            };
            var psObjdata = {
            };
            var psdata = cc.JsonToPostStr(psObjdata);
            HttpHelper.httpPost(cc.UrlTable.url_sy_get_tmp_card,psdata,onPostCallBack,this);
            cc.myShowView(cc.PanelID.LOADING_PAGE,10);  
        //}
    },
    onClickShiMingYanzheng()//点击实名验证的
    {
        if (Number(cc.UserInfo.ident) != 1) {//0 未提交身份证信息 1认证
            cc.showCommTip("您还没实名验证");
        }
        else{
            var onPostCallBack  = function(self,ret){
                if (ret != -1) {
                    cc.log("url_sy_get_gift ret= ",ret);
                    if (ret.status == "ok") {//成功
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
                        cc.myShowView(cc.PanelID.YL_POPUPPAGE,3,null,loadPrefabsCallBack); 
                        cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示
                        self.yanzheng_btn_node.active = false; //隐藏按钮
                        self.yanzhengfinishNode.active = true;//显示已经完成
                        
                    }else{
                        cc.showCommTip(ret.msg);
                    }
                    cc.myHideView(cc.PanelID.LOADING_PAGE)
                }
            };
            var psObjdata = {
                gift_id:1,//暂时传1
            };
            var psdata = cc.JsonToPostStr(psObjdata);
            HttpHelper.httpPost(cc.UrlTable.url_sy_get_gift,psdata,onPostCallBack,this);
            cc.myShowView(cc.PanelID.LOADING_PAGE,10);  
        }
    },
    onClickGuanZhuWechat()//点击关注的 跳转到其他页面
    {
        
        var loadPrefabsCallBack = function()
        {
           
        }

        cc.myShowView(cc.PanelID.SY_GUANZHU,12,null,loadPrefabsCallBack);  

    },


  
     update (dt) {
        //  if (cc.UserInfo.bonus_data != null && cc.UserInfo.bonus_data.today_bonus != null) {
        //     if ( this.todayAllProfitLabel.string == "") {
        //         this.todayAllProfitLabel.string =  Number(cc.UserInfo.bonus_data.today_bonus).toFixed(2);//今日总收益
        //         cc.log("显示今日总收益")
        //     }
        //  }
     },




});
