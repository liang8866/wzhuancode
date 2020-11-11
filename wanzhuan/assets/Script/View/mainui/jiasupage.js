// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        moenyLabelNode: { 
            default: null,
            type: cc.Node
        },
        leftLabelNode: { 
            default: null,
            type: cc.Node
        },
        isFlag:false,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.25;
            }
            var masklayout = cc.UITools.findNode(this.node,"masklayout");
            if (masklayout != null) {
                masklayout.scale = 1.25;
            }
        }

     },

    start () {
       this.onRefrshShow();

    },
    onRefrshShow()
    {
        this.moenyLabel = this.moenyLabelNode.getComponent(cc.Label);
        this.leftLable = this.leftLabelNode.getComponent(cc.Label);
        //0.01*次数*角色等级系数[初始系数=1，等级每2级，则系数+1]。
       
        var xishu = Math.round(Number(cc.UserInfo.level)/2);
    
        var f = parseFloat(Number(cc.UserInfo.rmb_jiasu+1) * xishu);
        this.money = 0.01*f;
       // cc.log("===========",this.money,f,Math.round(Number(cc.UserInfo.level)/2));
        this.moenyLabel.string = "消耗"+ this.money + "元付费加速("+ cc.UserInfo.rmb_jiasu + "/3次)";
        this.leftLable.string = "观看视频免费加速(" + cc.UserInfo.video_jiasu + "/3次)"

    },


    onSetHongBaoId(ID,parentScript){
        this.hbid = ID;
        this.parentScript = parentScript;
         // cc.log("===========onSetHongBaoId",this.parentScript)
        // cc.tempSelf = this;
       
    },
    onClickPlayMoney(){//点击支付钱
        if (cc.UserInfo.rmb_jiasu >=3) {
            cc.showCommTip("次数已达上限");
            return;
        }
        if (cc.UserInfo.rmb < this.money ) {
            
            cc.showCommTip("余额不足！");
            cc.myHideView(cc.PanelID.LOADING_PAGE);
            cc.onDestoryView(cc.PanelID.JIASU);
            cc.closeBannerAD();//关闭banner广告
            return;
        }
        this.onJiaSu(1);
    },
    onClickLookView(){//点击观看

        if (cc.UserInfo.video_jiasu >=3) {
            cc.showCommTip("次数已达上限");
            return;
        }
        if ( cc.UserInfo.limitTimeViedoFlag == true) {
            cc.showCommTip(Number.parseInt(cc.UserInfo.limitTime)+"秒后才能观看");
            return;
        }
        //this.onJiaSu(2);
        cc.closeBannerAD();//关闭banner广告
        cc.UserInfo.showVideoPage = this;

        cc.showRewardVideo("1");//显示激励视频


    },

    onFinishGetReward(){
        this.onJiaSu(2);
    },

    onJiaSu(tp){
        //1:人民币加速，2:视频加速
       
        
        cc.myShowView(cc.PanelID.LOADING_PAGE,10);  
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("============jiasu:",ret);
                if (ret.status == "ok") {//成功
                    // var perfab = cc.allViewMap[cc.PanelID.FUSHU_PAGE];
                    // var script = perfab.getComponent('fushupage');
                    cc.myHideView(cc.PanelID.LOADING_PAGE);
                    for (let index = 0; index < cc.UserInfo.hb_list.length; index++) {
                        const element = cc.UserInfo.hb_list[index];
                        if (element.id == self.hbid) {
                            cc.UserInfo.serverTime = ret.data.server_time;
                           
                            cc.UserInfo.sever_local_x = cc.getLocalTimeServer(cc.UserInfo.serverTime);
                          
                            cc.UserInfo.hb_list[index].cold_time = ret.data.cold_time;
                            cc.UserInfo.rmb_jiasu =   Number(ret.data.rmb_jiasu);
                            cc.UserInfo.video_jiasu =   Number(ret.data.video_jiasu);
                            //ret.data.cost
                            self.leftLable.string = "观看视频免费加速(" + cc.UserInfo.video_jiasu + "/3次)"
                            if (ret.data.cost != null) {
                                cc.UserInfo.rmb = Number.parseFloat(cc.UserInfo.rmb) -  Number.parseFloat(ret.data.cost.rmb );
                            }
                            self.isFlag = true;
                            self.onRefrshShow();
                            break;
                        }
                    }
                }

                else{

                    cc.myHideView(cc.PanelID.LOADING_PAGE);
                }
            }
           
        };
        var psObjdata = {
            id:this.hbid,
            type:tp,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
       
        HttpHelper.httpPost(cc.UrlTable.url_hb_jiasu,psdata,onPostCallBack,this);
    },
    onEndShow()
    {
        cc.showCommTip("加速成功");
       
        cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示
        cc.onDestoryView(cc.PanelID.JIASU);
        cc.closeBannerAD();//关闭banner广告
    },

    onCloseBtn(){//点击关闭
        cc.onDestoryView(cc.PanelID.JIASU);
        cc.closeBannerAD();//关闭banner广告
    },
     update (dt) {
        if (this.isFlag == true) {
            this.onEndShow();
            this.isFlag = false;
        }


     },
});
