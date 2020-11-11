

cc.Class({
    extends: cc.Component,

    properties: {
        myIDCountLabelNode:{
            default: null,
            type: cc.Node
        },
        parentIdLabelNode:cc.Node,
        // myLvLableNode:{
        //     default: null,
        //     type: cc.Node
        // },
        // myLvExpLableNode:{
        //     default: null,
        //     type: cc.Node
        // },
        myMoneyLableNode:{
            default: null,
            type: cc.Node
        },//我的资产
        weirenzhengNode:{
            default: null,
            type: cc.Node
        },//未认证提示
        iconNode:{
            default: null,
            type: cc.Node
        },//头像
        wihitebgNode:{
            default: null,
            type: cc.Node
        },
        topLayoutNode:{
            default: null,
            type: cc.Node
        },
        midLayoutNode:{
            default: null,
            type: cc.Node
        },
        rate_label_node:cc.Node,//领取临时分红卡百分比累计
        login_label_node:cc.Node,//当天是否登陆
        merge_label_node:cc.Node,//当天合体次数
        invite_label_node:cc.Node,//邀请队友的


        
        login_finish_node:cc.Node,
        merge_finish_node:cc.Node,
        invite_finish_node:cc.Node,

        yanzheng_btn_node:cc.Node,
        guanzhuwechat_btn_node:cc.Node,

        yanzhengfinishNode:cc.Node,//验证已经完成
        gzwechatfinishNode:cc.Node,//关注已经完成
        nickNameNode:cc.Node,
        isChangeIcon:true,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
        
            this.topLayoutNode.y = this.topLayoutNode.y +cc.iphone_off_Y*2;
            this.midLayoutNode.y = this.midLayoutNode.y +cc.iphone_off_Y*2;
            this.wihitebgNode.setContentSize(this.wihitebgNode.getContentSize().width,this.wihitebgNode.getContentSize().height + cc.iphone_off_Y*4);
        }

     },

    start () {

        
        this.flag = false;

        this.myIDCountLabel = this.myIDCountLabelNode.getComponent(cc.Label);

        var parentIdLabel = this.parentIdLabelNode.getComponent(cc.Label);
        parentIdLabel.string = "上级ID:" + cc.UserInfo.parent_id;

        this.myIDCountLabel.string = "账户ID:" + cc.UserInfo.id;
        this.myMoneyLabl = this.myMoneyLableNode.getComponent(cc.Label);
        this.myMoneyLabl.string = cc.UserInfo.rmb +"元";
        this.refreshRenZhengTip();
         this.nickName = this.nickNameNode.getComponent(cc.Label);
         this.nickName.string = cc.UserInfo.nickname;

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
    },

    setFenHongKaShow(data)
    {
        //cc.log("====setFenHongKaShow--",data)
        this.rate  =  data.rate;
        this.rate_label.string = data.rate+"%";//领取临时分红卡百分比累计
        // this.merge_label.string = data.merge;//当天合体次数
        if ( Number(data.login) == 1) {
            this.login_finish_node.active = true;
        }
        if ( Number(data.merge) >= 6) {
            this.merge_finish_node.active = true;
        }

    },
    onShowfollowMp()
    {
        if (cc.UserInfo.follow_mp == 1) {
            this.gzwechatfinishNode.active = true; 
            this.guanzhuwechat_btn_node.active = false;
         } 
    },


    refreshUiMoneyShow(){
        if ( this.myMoneyLabl!= null) {
            this.myMoneyLabl.string = cc.UserInfo.rmb +"元";
        }
       
    },

    refreshRenZhengTip()
    {
        if (Number(cc.UserInfo.ident) == 1) {//0 未提交身份证信息 1认证
            this.weirenzhengNode.active = false;
        }
    },
    
    onClickVipCenter()
    {
        cc.myShowView(cc.PanelID.PERSON_VIP,3,null,null);
    },
    onQianBaoMgr()
    {
        cc.myShowView(cc.PanelID.PERSON_TIXIAN,3,null,null);
    },
    onClickMid(event, customEventData)
    {   
        if ( this.flag == true) {
            
            return;
        }
        this.flag = false;
        var self = this;
        var idx = customEventData;
        if (idx == 1) {//玩赚队伍
            self.flag = false;
            var loadPrefabsCallBack = function(perfab)
            {

               
            }
            cc.myShowView(cc.PanelID.PERSON_WANDUIWU,3,null,loadPrefabsCallBack);
            //cc.showCommTip("即将开放");
        }else if (idx == 2) {//身份验证
            //cc.showCommTip("即将开放");
            // var loadPrefabsCallBack = function(perfab)
            // {
            //     var script = perfab.getComponent('nameident');
            //     script.onPostToGetData(self);
            //     self.flag = false;
            // }
    
            // cc.myShowView(cc.PanelID.PERSON_IDNET,7,null,loadPrefabsCallBack);  
           
        }
        else if (idx == 3) {//加入社群
            var loadPrefabsCallBack = function(perfab)
            {
                self.flag = false;
            }
            cc.myShowView(cc.PanelID.PERSON_jOINCOMMUNITY,7,null,loadPrefabsCallBack);
        }
        else if (idx == 4) {//通告
            var loadPrefabsCallBack = function(perfab)
            {
                self.flag = false;
            }
            cc.myShowView(cc.PanelID.PERSON_TONGGAO,7,null,loadPrefabsCallBack);
        }
        else if (idx == 5) {//设置
            var loadPrefabsCallBack = function(perfab)
            {
                self.flag = false;
            }
            cc.myShowView(cc.PanelID.PERSON_SETTING,7,null,loadPrefabsCallBack);
        }
       

    },


    onClickGetTmpCard()//领取临时分红卡
    {
        
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
      
    },
    onClickShiMingYanzheng()//点击实名验证的
    {
        cc.log("======= cc.UserInfo.ident = ",cc.UserInfo.ident)
        if (Number(cc.UserInfo.ident) != 1) {//0 未提交身份证信息 1认证
            var self = this;
            var loadPrefabsCallBack = function(perfab)
            {
                var script = perfab.getComponent('nameident');
                script.onPostToGetData(self);
                self.flag = false;
            }
    
            cc.myShowView(cc.PanelID.PERSON_IDNET,7,null,loadPrefabsCallBack);  
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
        if (this.isChangeIcon == true ) {
            // cc.log("cc.UserInfo.head =",cc.UserInfo.head)
            if (cc.UserInfo.head != null && cc.UserInfo.head !="" ) {
                var headSp =   this.iconNode.getComponent(cc.Sprite); 
                 
                cc.loadUrlImg(headSp,cc.UserInfo.head);//加载图像
                this.isChangeIcon = false;
            }
        }

     },
});
