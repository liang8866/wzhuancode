

cc.Class({
    extends: cc.Component,

    properties: {
        myLeftLableNode:cc.Node,
        
        bgNode:cc.Node,
        maskButtonNode:cc.Node,
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.35;
            }
            this.bgNode.scale = 1.35;
        }
        
        this.onRefreshLeftTime();
    },
    onRefreshLeftTime()
    {
        var myLeftLable = this.myLeftLableNode.getComponent(cc.Label);
        myLeftLable.string = "剩余次数："+ cc.UserInfo.explore_times;
    },

   
    onClickClose(){
       
        cc.onDestoryView(cc.PanelID.YL_TANSUO);
    },
    onClickTanSuo(){
        if (Number(cc.UserInfo.explore_times) <= 0 ) {
            cc.showCommTip("剩余次数不足");
        }
        else{

            if ( cc.UserInfo.limitTimeViedoFlag == true) {
                cc.showCommTip(Math.ceil(cc.UserInfo.limitTime)+"秒后才能观看");
                return;
            }
            cc.UserInfo.showVideoPage = this;
            this.showRewardVideo("3");//显示激励视频
            
        }
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
                if (ret.status == "ok") {//成功
                    var data = ret.data
                    cc.log("探索成功 ret= ",ret);
                    cc.UserInfo.explore_times = Number.parseInt(data.explore_times) ;
                    self.onRefreshLeftTime();
                    self.onShowGet(data);
                }else{
                    cc.log("探索失败 ret= ",ret);
                    cc.showCommTip(ret.msg);
                }
            }
        };
        var psObjdata = {
           
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_long_explore,psdata,onPostCallBack,this);
    },

    onShowGet(data)//显示获得的物品
    {
        var self = this;
        if (Number(data.type) == 1 ) {// 1兑换金币
            
             //显示获得物品
            
             var loadPrefabsCallBack = function()
             {
                 var mperfab = cc.allViewMap[cc.PanelID.YL_EXPLOREEXCHANGE];
                 var mscript = mperfab.getComponent('exploreExchange');
                 mscript.onShowUi(data.explore_itemid,data.explore_gold,self);
             }
             cc.myShowView(cc.PanelID.YL_EXPLOREEXCHANGE,7,null,loadPrefabsCallBack); 

        } 
        else if(Number(data.type) == 2 ||Number(data.type) == 3) {//2获得物品 3获得永久分红卡
            var itemsList = data.reward.items;
            for (let i= 0; i < itemsList.length; i++) {
                var element = itemsList[i];
               cc.UserInfo.addItems(element[0],element[1]);
            }

            //显示获得物品
            var loadPrefabsCallBack = function()
            {
                var mperfab = cc.allViewMap[cc.PanelID.YL_POPUPPAGE];
                var mscript = mperfab.getComponent('popuppage');
                mscript.onShowUi(cc.popviewType.getitems,Number(element[0]),null);
            }
            cc.myShowView(cc.PanelID.YL_POPUPPAGE,7,null,loadPrefabsCallBack); 
         
        }
       
        this.onRefreshLeftTime()
        

    },

   
    // update (dt) {},
});


