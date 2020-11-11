

cc.Class({
    extends: cc.Component,

    properties: {
        moneyLableNode:cc.Node,
        downLayerNode:cc.Node,
        
        topLayoutNode:cc.Node,
        topBgNode:cc.Node,
        maskLayout:cc.Node,
    },
    // const CostJiasu         = 1; //福树包瞬间完成
    // const Cash              = 2; //提现至微信 - tag
    // const GuessFrist        = 3; //首次猜宝箱
    // const Guess             = 4; //猜一猜(现金奖励)
    // const Summon            = 5; //首次招龙红包 - tag
    // const Merge             = 6; //27级龙合体(现金奖励)
    // const MergeElement      = 7; //元素之龙合成保护
    // const ZhuanPan          = 8; //幸运转盘(抽奖))
    // const PermanentBonus    = 9; //永久分红卡-分红
    // const TempBonus         = 10; //单词分红卡-分红
    // const Merge1            = 11; //元素之龙合体
    // const Merge2            = 12; //四象守护龙合体
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.25;
            }
            this.topLayoutNode.y = this.topLayoutNode.y +cc.iphone_off_Y*2.0;
            this.topBgNode.setContentSize(this.topBgNode.getContentSize().width,this.topBgNode.getContentSize().height + cc.iphone_off_Y*2.0);
            this.topBgNode.y = this.topBgNode.y +cc.iphone_off_Y*3.0;
            this.maskLayout.setContentSize(this.maskLayout.getContentSize().width,this.maskLayout.getContentSize().height + cc.iphone_off_Y*6);
        }

     },

    start () {
        
        this.moneyLable = this.moneyLableNode.getComponent(cc.Label);
        this.freshMyMoney();
        this.moneylist = [300,200,100,50,40,30,25,20,15,10,0.3];
        this.limitList = {
            10:6,
            15:5,
            20:4,
            25:3,
        };
        this.freshMoneyBtnShow();
        this.clickIdx = -1;

        
    },

    freshMyMoney()
    {
        this.moneyLable.string = "" + cc.UserInfo.rmb;
    },

    freshMoneyBtnShow()
    {
        for (let index = 1; index < 12; index++) {
            var m = this.moneylist[index-1];
            var btnNode = cc.UITools.findNode(this.downLayerNode,"jinerButton"+index);
            var btn = btnNode.getComponent(cc.Button);
            
            var backgroundNode = cc.UITools.findNode(btnNode,"Background");  
            var maskNode =  cc.UITools.findNode(btnNode,"maskNode");
            var limit = this.limitList[m];
            if (limit ==null) {
                limit = -1;
            }
            if (Number(cc.UserInfo.vip) > limit) {
                btn.interactable = true;
                backgroundNode.active = true;
                maskNode.active = false;
            }
            else{
               // btn.interactable = false;
                backgroundNode.active = false;
                maskNode.active = true;
            }
           
            if (Number(cc.UserInfo.cash_min) == 1 && index == 11) {//是否可提最小0.5金额（0可提，1不可提)
                btnNode.active = false;//不显示
            }
        }

    },

     onClickJinerBtn(event, customEventData)
     {

        this.freshMoneyBtnShow();

        var node = event.target;
        var button = node.getComponent(cc.Button);
        button.interactable = false;
        this.clickIdx = customEventData - 1;
        //cc.log(this.clickIdx);
        var m = this.moneylist[this.clickIdx];
        var limit = this.limitList[m];
        if (limit ==null) {
            limit = -1;
        }
        if (Number(cc.UserInfo.vip) < limit) {
            var str = "vip等级未达到等级" + limit;
           
            cc.showCommTip(str);
        }

     } ,

     onClickQianBaoJilu()//点击提现记录
     {  
        cc.log("点击提现记录");
        cc.myShowView(cc.PanelID.PERSON_MONEYLOG,10,null,null);
     },
     onClickTiXianShuoMing()
     {
        cc.log("点击提现说明");
        
        cc.myShowView(cc.PanelID.PERSON_TIXIANSHUOMING,10,null,null);
     },
     onClickClose()
     {
        cc.onDestoryView(cc.PanelID.PERSON_TIXIAN);
     },

     onClickComfirm()//点击立即提现
     {
        if (this.clickIdx != -1) {
            cc.log("=========点击立即提现=====")
            if ( Number(cc.UserInfo.level) < 6 ) {// Number(cc.UserInfo.ident) == 0 0 未提交身份证信息 1认证
                cc.showCommTip("魔龙未满足6阶");
            }else{
                var m = this.moneylist[this.clickIdx];
                if (cc.UserInfo.rmb < m) {
                    
                    cc.showCommTip("余额不足");
                }
                else{
                    this.onPostTixian();
                }
               
            }
        }

     },

     onPostTixian()
     {  
         var self = this;
          //请求龙的数据列表
          var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("提现返回数据:",ret);
                if (ret.status == "ok") {//成功
                    var data = ret.data
                    cc.UserInfo.rmb = Number(data.rmb);
                    cc.UserInfo.cash_min = Number(data.cash_min);
                    cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示
                    self.freshMyMoney();
                    self.freshMoneyBtnShow()
                   
                    cc.showCommTip(ret.msg);
                }else{
                    
                    cc.showCommTip(ret.msg);
                  
                }
            }
        };
        var psObjdata = {
            amount:this.moneylist[this.clickIdx],
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_tixian,psdata,onPostCallBack,this);
     },

    // update (dt) {},
});
