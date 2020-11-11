

cc.Class({
    extends: cc.Component,

    properties: {
        bgNode: {//
            default: null,
            type: cc.Node
        },
        getgoldLayoutNode: {//获得金币的layout
            default: null,
            type: cc.Node
        },

        jiesuoLayoutNode: {//解锁的layout
            default: null,
            type: cc.Node
        },
        
        goldNoLayoutNode: {//金币不足的layout
            default: null,
            type: cc.Node
        },
        huiShouLayoutNode: {//回收的layout
            default: null,
            type: cc.Node
        },

        getrmbLayoutNode: {//获得rmb
            default: null,
            type: cc.Node
        },

        getitemLayoutNode: {//获得物品
            default: null,
            type: cc.Node
        },

        //获得金币的--------
        GetGoldLabelNode: {//
            default: null,
            type: cc.Node
        },

        //金币不足的-------
        willgetgoldLableNode: {//
            default: null,
            type: cc.Node
        },

        huishouLabelNode:cc.Node,//回收金币的

        //解锁龙的
        tiplongNode: {//
            default: null,
            type: cc.Node
        },
        longiconNode: {//
            default: null,
            type: cc.Node
        },
        callback:null,
        newRmbTextNode:cc.Node,//新获取钱的
        newRmbLayoutNode:cc.Node,//节点

        rmbLabel:cc.Node,//人民币的
        /////////////////////////
        //获得物品的
        itemIconNode:cc.Node,
        itemNameNode:cc.Node,
        itemDescNode:cc.Node,

        rmbIconNode:cc.Node,
        rmbDescLbaleNode:cc.Node,
        descLeftTimeNode:cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
        // this.bgNode.scale = 0.1;
        // var act = cc.scaleTo(0.3,1.0);
        // this.bgNode.runAction(act);
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
    
    onShowUi(uitype,data,callback)//显示类型
    {   
        // 1 获得金币   2 金币不足  3解锁龙的  4 回收魔龙的  5获得rmb的  6 获得物品的
        this.data = data;
        this.callback = callback;//回调函数的
        this.getgoldLayoutNode.active = false;
        this.goldNoLayoutNode.active = false;
        this.jiesuoLayoutNode.active = false;
        this.huiShouLayoutNode.active = false;
        this.getrmbLayoutNode.active = false;
        this.getitemLayoutNode.active = false;
        this.newRmbLayoutNode.active = false;
        this.bgNode.active = true;

        if (uitype == cc.popviewType.getgold) {
            this.getgoldLayoutNode.active = true;
            var GetGoldLabel= this.GetGoldLabelNode.getComponent(cc.Label);
            GetGoldLabel.string = "+"+ data + "金币";
        }
        else if (uitype ==cc.popviewType.lackgold) {
            this.goldNoLayoutNode.active = true;
            var willgetgoldLable= this.willgetgoldLableNode.getComponent(cc.Label);
            willgetgoldLable.string = "+" + data + "金币";
        }
        else if (uitype == cc.popviewType.jiesuolong) {//解锁龙的
            this.jiesuoLayoutNode.active = true;
            var longicon = this.longiconNode.getComponent(cc.Sprite);
            var tiplongLabel = this.tiplongNode.getComponent(cc.Label);
            var longData =  cc.configMgr.getLongBaseDataByStep(data);
            tiplongLabel.string = "恭喜你，成功解锁"+ longData.step +"阶龙";
            cc.setLongIcon(longData.iconName,longicon);

        }
        else if (uitype == cc.popviewType.huishoumolong) {
            this.huiShouLayoutNode.active = true;
            var huishouLabel = this.huishouLabelNode.getComponent(cc.Label);
            huishouLabel.string = "+"+ data + "金币";
        }
        else if (uitype == cc.popviewType.getrmb) {
            this.newRmbLayoutNode.active = true;
            this.bgNode.active = false;
            var getrmbLabel = this.newRmbTextNode.getComponent(cc.Label);
            if (data.constructor == Array ) {
                var itemId =  Number(data[0]);
                var num = Number(data[1]);
                getrmbLabel.string = "￥"+ num + "元";
            }
            else{
                getrmbLabel.string = "￥"+ data + "元";
            }

            
        }
        else if (uitype == cc.popviewType.getitems) {
            this.getitemLayoutNode.active = true;
            var itemIcon = this.itemIconNode.getComponent(cc.Sprite);
            var itemId =  Number(data);
            var itemdata = cc.configMgr.getItemDataById(itemId);
            cc.log(itemId,itemdata);
            cc.setItemIcon(itemdata.icon,itemIcon);

            var itemNameLbael = this.itemNameNode.getComponent(cc.Label);
            itemNameLbael.string = itemdata.name;
            var itemDescLabel = this.itemDescNode.getComponent(cc.Label);
            itemDescLabel.string = itemdata.desc;
        }

        var random = parseInt(100 * Math.random() );
        if (random % 2 == 0) {
            var random1 = parseInt(100 * Math.random() );
            if (random1 % 2 == 0) {
                this.showIAD();//显示插屏广告();
            }
            else{
                this.showTTIAD();//显示插屏广告();
            }
           
        }

       
        var descLeftTimeLabel = this.descLeftTimeNode.getComponent(cc.Label);
        descLeftTimeLabel.string = "每天22时重置视频次数（剩余"+cc.UserInfo.adv_times +"次）";
        
    },
 
   //显示bannerAd
    showBannerAD ()
   {
       if (cc.sys.os == cc.sys.OS_ANDROID) {
           jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showBannerAD', '()V');
       }
       else if (cc.sys.os == cc.sys.OS_IOS) {
 
       }
 
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
    
    //显示插屏
    showTTIAD()
    {
  
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showTTIAD', '()V');
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
        
        }
  
    },

    onClickClose()//点击关闭按钮
    {
        cc.log( cc.closeBannerAD)
        cc.log(cc.PanelID.YL_POPUPPAGE)
        this.closeBannerAD()//关闭banner
        if (this.callback) {
            this.callback(0);
        }
        cc.onDestoryView(cc.PanelID.YL_POPUPPAGE);
    
    },
  //-------------------------------------------------------------------
    onClickGetGoldComfirmBtn()//点击获得金币按钮的确认
    {
        this.closeBannerAD()//关闭banner
        if (this.callback) {
            this.callback(1);
        }
        cc.onDestoryView(cc.PanelID.YL_POPUPPAGE);
    },

    //-------------------------------------------------------------------
    //点击金币不足的观看视频
    onClickLookVideo(){
        if ( cc.UserInfo.limitTimeViedoFlag == true) {
            cc.showCommTip(Number.parseInt(cc.UserInfo.limitTime)+"秒后才能观看");
            return;
        }
        this.closeBannerAD()//关闭banner
        if (this.callback) {
            this.callback(1);
        }
        cc.onDestoryView(cc.PanelID.YL_POPUPPAGE);
    },
    
    onClickXuanYao(){//点击炫耀一下
        this.closeBannerAD()//关闭banner
        if (this.callback) {
            this.callback(1);
        }
        cc.onDestoryView(cc.PanelID.YL_POPUPPAGE);

    },

    //-------------------------------------------------------------------
    onHuiShouCancelBtn()//回收取消按钮的
    {
        this.closeBannerAD()//关闭banner
        if (this.callback) {
            this.callback(0);
        }

        cc.onDestoryView(cc.PanelID.YL_POPUPPAGE);
    },
    
    onHuiShouComfirmBtn()//回收的确认
    {
        this.closeBannerAD()//关闭banner
        if (this.callback) {
            this.callback(1);
        }
        cc.onDestoryView(cc.PanelID.YL_POPUPPAGE);
    },

    onGetRmbComfirmBtn()//Rbm的确认
    {
        this.closeBannerAD()//关闭banner
        if (this.callback) {
            this.callback(1);
        }
        cc.onDestoryView(cc.PanelID.YL_POPUPPAGE);
    },
    onGetItemsComfirmBtn()//item的确认
    {
        this.closeBannerAD()//关闭banner
        if (this.callback) {
            this.callback(1);
        }
        cc.onDestoryView(cc.PanelID.YL_POPUPPAGE);
    },

    getRichString(goldNum){//获得金币的rich
        var str = "<size=32><color=#0EEB17>+</color></size><size=40><color=#66FF00>"+ goldNum + "</color></size><size=22><color=#0EEB17>金币</color></size>"
        return str;
    } ,  
    
    //关闭广告
  closeBannerAD () {
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'destroyBannerAD', '()V');
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    }

}
    // update (dt) {},
});

