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
        maskLayoutNode:cc.Node,
        closeBtnNode:cc.Node,
        countTime:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.25;
            }
          
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*8);
        }
        
    },

    start () {
       this.countTime = 0;
       
    },
    onClickBx(vent, customEventData){//点击那个宝箱的

        if (this.countTime<5) {
            cc.showCommTip(Number.parseInt(5.0-this.countTime)+"秒后才能选择");
            return;
        }
        var idx = customEventData;
       
        var fag = false;
        var onPostCallBack  = function(self,ret){
            
            if (ret != -1) {
                cc.log("onClickBx  =",ret);
                if (ret.status == "ok") {//成功
                    self.onShowAnswer(ret);
                }else{
                    cc.showCommTip(ret.msg);
                }
                fag = true;
            }
            cc.myHideView(cc.PanelID.LOADING_PAGE);
        };
        cc.myShowView(cc.PanelID.LOADING_PAGE,10,null,null);
        //请求偷的信息信息的
        var psObjdata = {
            
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_hb_guess,psdata,onPostCallBack,this);


        var delayAct = cc.delayTime(10);
        var seq = cc.sequence(delayAct,cc.callFunc(function(){
            cc.myHideView(cc.PanelID.LOADING_PAGE);
            })
        );
       this.node.runAction(seq)
    },
    onCloseBack(){//点击关闭的
        cc.onDestoryView(cc.PanelID.STEALCAICAI);
    },
    onShowAnswer(ret){
        
        var callback = function(){
            var perfab = cc.allViewMap[cc.PanelID.STEALCAI_ANSWER];
            var answerScript = perfab.getComponent('stealcaianswer');
            answerScript.initShowUi(ret);
            cc.onDestoryView(cc.PanelID.STEALCAICAI);
        }
        cc.myShowView(cc.PanelID.STEALCAI_ANSWER,4,null,callback);
    },
     update (dt) {
         
        this.countTime =  this.countTime +dt;

     },
});
