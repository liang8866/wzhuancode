

cc.Class({
    extends: cc.Component,

    properties: {
      
    
        hechengbgNode:cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
       
        this.itemIdList = [101,102,103,104,105,106,107,108,109,110];
        this.onRefreshShowDan();
        this.isChecked = true;//默认选中
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
    setParentScript(ps)
    {
        this.parentScript = ps;
    },
    onRefreshShowDan()
    {
        for (let index = 1; index < 11; index++) {
            var dankuangNode = cc.UITools.findNode(this.hechengbgNode,"dan_kuang"+index)
            var icon = cc.UITools.findSprite(dankuangNode,"icon");
            var namelabel = cc.UITools.findLabel(dankuangNode,"nameLabel");
            var numRichText =cc.UITools.findRichText(dankuangNode,"numRichText")
            var itemid = this.itemIdList[index -1];
            var itemdata = cc.configMgr.getItemDataById(itemid);
            cc.setItemIcon(itemdata.icon,icon);
            var num = cc.UserInfo.getItemNum(itemid);
            numRichText.string = "<color=#000000>(</c><color=#FF0000>"+num +"</color><color=#000000>/1)</c>";
            namelabel.string = itemdata.name;
        }
    },
    
   
    onClickClose(){
       
        cc.onDestoryView(cc.PanelID.YL_TESU_HECHENG);
    },
    togglecallback: function(toggle, customEventData) {
        cc.log(toggle.isChecked);
        this.isChecked = toggle.isChecked;
    },

    onClickComfirm(){

        var flag = true;
        for (let index = 0; index < 10; index++) {
            const itemid =  this.itemIdList[index];
            var num = cc.UserInfo.getItemNum(itemid);
            if ( num <= 0 ) {
                flag = false;
                break;
            }
        }
        if (flag == false) {
            cc.showCommTip("材料不足！");
            
        }

        else{
            if (this.isChecked == true) { //选了友情卡的
                if (this.getYouQingKaNum() <= 0) {
                    cc.showCommTip("材料不足！");
                    return;
                }
            }

            var onPostCallBack  = function(self,ret){
                if (ret != -1) {
                    if (ret.status == "ok") {//成功
                        var data = ret.data
                        //cc.log("合成 ret= ",ret);
                        var data = ret.data
                        var cost = data.cost;
                        if (cost != null&&  cost.items != null) {
                            for (let index = 0; index < cost.items.length; index++) {
                                const element = cost.items[index];
                                cc.UserInfo.reduceItems(element[0],element[1]);
                            }
                        }
                        if (cost.rmb != null) {
                            cc.UserInfo.rmb = Number.parseFloat(cc.UserInfo.rmb) - Number.parseFloat(cost.rmb);
                        }

                        self.onRefreshShowDan();
                        cc.refreshMoneyShow();//刷新显示界面
                        if (Number(data.merge_status) == 1) {
                            
                            var reward = data.reward;
                            if (reward != null) {
                                cc.UserInfo.addItems(reward.items[0][0],reward.items[0][1]);//增加一个
                                 //显示获得物品
                                var loadPrefabsCallBack = function()
                                {
                                    var mperfab = cc.allViewMap[cc.PanelID.YL_POPUPPAGE];
                                    var mscript = mperfab.getComponent('popuppage');
                                    mscript.onShowUi(cc.popviewType.getitems,reward.items[0][0],null);
                                }
                                cc.myShowView(cc.PanelID.YL_POPUPPAGE,10,null,loadPrefabsCallBack); 
                            }
                            if (self.parentScript.onRefreshShow) {
                                self.parentScript.onRefreshShow();//刷新父节点的显示

                            }
                           
                        }else{
                            cc.showCommTip("合成失败！");
                        }





                    }else{
                        cc.log("合成失败 ret= ",ret);
                        cc.showCommTip(ret.msg);
                    }
                }
            };
            var iscost_rmb = 1;
            if (this.isChecked == false) {
                iscost_rmb = 0;
            }
            var psObjdata = {
                cost_rmb:iscost_rmb,
            };
            var psdata = cc.JsonToPostStr(psObjdata);
            HttpHelper.httpPost(cc.UrlTable.url_long_merge_element,psdata,onPostCallBack,this);
        }
    },


    getYouQingKaNum(){
         var num = 0
         //查找还有多少个
         for (let i = 0; i < cc.UserInfo.items_list.length; i++) {
            const element =  cc.UserInfo.items_list[i];
            if (parseInt(element.item_id) ==  191 ) {
                num =   element.num;
            
              break;
            }
        }
        return num;
    },
    // update (dt) {},
});


