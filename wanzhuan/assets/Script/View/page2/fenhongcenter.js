
cc.Class({
    extends: cc.Component,

    properties: {
       allShouYiLabelNode:cc.Node,//全网广告总收益
       yj_fenpei_num_Node:cc.Node,//永久的可分配总数
       yj_quanwang_num_Node:cc.Node,//永久的全网总数
       yj_yugu_num_Node:cc.Node,//永久的临时每个可分配

       ls_fenpei_num_Node:cc.Node,//临时的可分配总数
       ls_quanwang_num_Node:cc.Node,//临时的全网总数
       ls_yugu_num_Node:cc.Node,//临时的临时每个可分配
       GgRichNode:cc.Node,
        count:0,
        my_permanent_num_node:cc.Node,
        my_tmp_num_node:cc.Node,

        maskLayoutNode:cc.Node,
        topLayout:cc.Node,
        scrollLayoutNode:cc.Node,
        scrollView:cc.Node,
        scrollViewContent:cc.Node,
        item_prefab:{  //项的资源预制体
            type:cc.Prefab,
            default:null,
        },
        itemLayoutNode:cc.Node,
        fag:0,
        itemList:[],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.35;
            }
            this.topLayout.y = this.topLayout.y +cc.iphone_off_Y*2.0;
            this.scrollLayoutNode.y = this.scrollLayoutNode.y + cc.iphone_off_Y*2.5;
            this.scrollLayoutNode.setContentSize(this.scrollLayoutNode.getContentSize().width,this.scrollLayoutNode.getContentSize().height + cc.iphone_off_Y*2.5);
            this.scrollView.setContentSize(this.scrollView.getContentSize().width,this.scrollView.getContentSize().height + cc.iphone_off_Y*2.5);
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*8);
        }
    },

    

    start () {

        for (let index = 0; index < this.itemList.length; index++) {
            const item = this.itemList[index];
            if (item != null) {
                item.destroy();
            }
        }

        this.allShouYiLabel =  this.allShouYiLabelNode.getComponent(cc.Label);//全网广告总收益
        if (cc.UserInfo.bonus_data == null) {
           
            return;
        }
        this.allShouYiLabel.string = cc.UserInfo.bonus_data.today_bonus;

         this.yj_fenpei_num =  this.yj_fenpei_num_Node.getComponent(cc.Label);//永久的可分配总数
         this.yj_fenpei_num.string = cc.UserInfo.bonus_data.today_permanent_num;

        this.yj_quanwang_num =  this.yj_quanwang_num_Node.getComponent(cc.Label);//永久的全网总数
        this.yj_quanwang_num.string = cc.UserInfo.bonus_data.permanent_num;

         this.yj_yugu_num =  this.yj_yugu_num_Node.getComponent(cc.Label);//永久的临时每个可分配
         var n1 = Number(cc.UserInfo.bonus_data.permanent_bonus) / Number(cc.UserInfo.bonus_data.permanent_num) ;
         if (Number(cc.UserInfo.bonus_data.permanent_bonus) == 0 || Number(cc.UserInfo.bonus_data.permanent_num) == 0) {
            n1 = 0; 
        }
         this.yj_yugu_num.string = n1.toFixed(2);

         this.ls_fenpei_num =  this.ls_fenpei_num_Node.getComponent(cc.Label);//临时的可分配总数
         this.ls_fenpei_num.string = cc.UserInfo.bonus_data.tmp_bonus;

        this.ls_quanwang_num =  this.ls_quanwang_num_Node.getComponent(cc.Label);//临时的全网总数
        this.ls_quanwang_num.string = cc.UserInfo.bonus_data.tmp_num;

        this.ls_yugu_num =  this.ls_yugu_num_Node.getComponent(cc.Label);//临时的临时每个可分配
        var n2 = Number(cc.UserInfo.bonus_data.tmp_bonus) / Number(cc.UserInfo.bonus_data.tmp_num) ;
        if (Number(cc.UserInfo.bonus_data.tmp_bonus) == 0 || Number(cc.UserInfo.bonus_data.tmp_num) == 0) {
            n2 = 0; 
        }
        this.ls_yugu_num.string = n2.toFixed(2);

        this.my_permanent_num =  this.my_permanent_num_node.getComponent(cc.Label);
        this.my_permanent_num.string = cc.UserInfo.bonus_data.self_permanent_num +"";

        this.my_tmp_num =  this.my_tmp_num_node.getComponent(cc.Label);
        this.my_tmp_num.string = cc.UserInfo.bonus_data.self_tmp_num+"";
      
        // if (this.fag == 0) {
        //     this.showGongGao();//显示公告
        // }
        this.onPostGetCarLog();
        this.fag = 1;
    },
    onClickClose(){//点击关闭

        cc.onDestoryView(cc.PanelID.YL_FENHONGCENTER);


    },

    onClickYJWenHao(){
        
        var loadPrefabsCallBack = function(perfab)
        {
            var script = perfab.getComponent('wenhaopage');
            script.onShowUi(2);
        }
        cc.myShowView(cc.PanelID.COM_WENHAOPAGE,8,null,loadPrefabsCallBack);  

    },
    onClickLSWenHao(){
        var loadPrefabsCallBack = function(perfab)
        {
            var script = perfab.getComponent('wenhaopage');
            script.onShowUi(1);
        }
        cc.myShowView(cc.PanelID.COM_WENHAOPAGE,8,null,loadPrefabsCallBack);  

    },

    // showGongGao(){//显示公告
    //     if (cc.UserInfo.bonus_data.bonus_log != null && cc.UserInfo.bonus_data.bonus_log.length >= 1) {
    //         var itemdata =  cc.UserInfo.bonus_data.bonus_log[this.count];
    //         var richText = this.GgRichNode.getComponent(cc.RichText);
    //         richText.string =  cc.fenhongcenterRichString(itemdata);
    //         this.GgRichNode.x = 320;
    //         var self = this;
    //         var callback = function(){
    //             self.nextShowGG();
    //         }
    //         var seq = cc.sequence(cc.moveTo(15,-1000, 0), cc.callFunc(callback));
    //         this.GgRichNode.runAction(seq);
            
    //     }
       
    // },

    // nextShowGG(){
    //     var self = this;
    //     var callback = function(){
    //         self.count =  self.count + 1;
    //         if (self.count > cc.UserInfo.bonus_data.bonus_log.length) {
    //             self.count = 0;
    //         }
    //         self.showGongGao();
    //     }
    //     var seq = cc.sequence(cc.delayTime(5), cc.callFunc(callback));
    //     this.GgRichNode.runAction(seq);
    // },

    onPostGetCarLog()
    {
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功,弹出获得物品
                    cc.log("onPostGetCarLog====",ret);
                    var data = ret.data;
                    self.onShowLogLayout(data.list);
                }
            }
        };
        var psObjdata = {
           
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_get_card_log,psdata,onPostCallBack,this);

    },
    onShowLogLayout(list)
    {
       var count = 0;
        for (const key in list) {
            if (list.hasOwnProperty(key)) {
                const element = list[key];
                count = count + 1;
                var item = cc.instantiate(this.item_prefab);
                this.itemLayoutNode.addChild(item);
                var script = item.getComponent('fenhongitem');
                script.onSetData(element);
                this.itemList.push(item);//保存起来
            }
        }
        if (count >10) {
            if (cc.getIsIphoneX() == true) {
                this.scrollLayoutNode.setContentSize(this.scrollLayoutNode.getContentSize().width,1700+(i-10)*80);
            }
            else{
                this.scrollLayoutNode.setContentSize(this.scrollLayoutNode.getContentSize().width,1770+(i-10)*80);
            }
           
        }
       
    },


    // update (dt) {},
});
