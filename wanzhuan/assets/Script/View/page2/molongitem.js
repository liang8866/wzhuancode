

cc.Class({
    extends: cc.Component,

    properties: {
        nameLabelNode:cc.Node,
        longIconNode:cc.Node,
        zhaohuanNumLabelNode:cc.Node,
        desc1LabelNode:cc.Node,
        desc2LabelNode:cc.Node,
        desc3LabelNode:cc.Node,
        desc4LabelNode:cc.Node,
        tipGetLabelNode:cc.Node,
        duihuanBtnNode:cc.Node,
        hechengBtnNode:cc.Node,
        item_id:0,
        zhaoHuanNum:0,
        item_idx:null,
        fag:0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    setShowData(data){
        this.data = data;
          //---设置头像的和名字的
          if (this.fag == 0) {
            var longIcon = this.longIconNode.getComponent(cc.Sprite);
            cc.setLongIcon(data.iconName,longIcon);
            this.fag =1;
          }
       
        
        var tipGetLabel = this.tipGetLabelNode.getComponent(cc.Label);
        
        if (data.type == 2) {
            tipGetLabel.string = "通过元素灵蛋合成获得";
            this.duihuanBtnNode.active = false;
            this.hechengBtnNode.active = true;
            this.item_id = 301;
        }else if(data.type == 3)
        {
            this.duihuanBtnNode.active = true;
            this.hechengBtnNode.active = false;
            tipGetLabel.string = "通过友情卡兑换获得";
            this.item_id = 401;
        }
        else{
            tipGetLabel.string = "";
        }

        this.onRefreshShow();
        
    },

    

    onRefreshShow(){
        var data = this.data;
        var nameLabel = this.nameLabelNode.getComponent(cc.Label);
        var zhaohuanNumLabel = this.zhaohuanNumLabelNode.getComponent(cc.Label);
        var desc1Label = this.desc1LabelNode.getComponent(cc.Label);
        var desc2Label = this.desc2LabelNode.getComponent(cc.Label);
        var desc3Label = this.desc3LabelNode.getComponent(cc.Label);
        var desc4Label = this.desc4LabelNode.getComponent(cc.Label);
        
        nameLabel.string = data.name;
        var tujianData = cc.configMgr.getLongTuJianDataById(data.id);
        desc1Label.string = tujianData.desc1;
        desc2Label.string = tujianData.desc2;
        desc3Label.string = tujianData.desc3;
        desc4Label.string = tujianData.desc4;


        //查找还有多少个
        for (let i = 0; i < cc.UserInfo.items_list.length; i++) {
            const element =  cc.UserInfo.items_list[i];
            if (parseInt(element.item_id) ==  this.item_id ) {
              this.zhaoHuanNum =   element.num;
              this.item_idx = i;//在拥有的物品中的idx
              break;
            }
        }
        zhaohuanNumLabel.string = "可召唤:"+ this.zhaoHuanNum +"次"
    },

 

    onClickZhaoHuan(){

      

             //请求龙的数据列表
             var onPostCallBack  = function(self,ret){
                if (ret != -1) {
                    if (ret.status == "ok") {//成功
                        var data = ret.data
                        cc.log("===========ret= ",ret);
                        
                        var item = {
                            id:data.long.id,
                            index:data.long.index,
                            level: data.long.level,
                            long_id:self.data.id,
                            stage:data.long.stage,
                            uid: data.long.uid,
                        }
                        cc.UserInfo.addUserinfolong(item)
                        var script2 = cc.getPageSriptByIndx(2);
                        if (script2 != null) {
                            script2.addOneLong(item);//招呼了就增加一条龙
                        }
                        
                        if (data.cost.items) {
                             //更新x消耗列表
                            if (self.item_idx != null) {
                                for (let i = 0; i< data.cost.items.length; i++) {
                                    const elt = data.cost.items[i];
                                    if (Number(elt[0]) == self.item_id ) {
                                        cc.UserInfo.items_list[self.item_idx].num =  cc.UserInfo.items_list[self.item_idx].num - parseInt(Number(elt[1]));
                                    }
                                    
                                }
                            }
                        }

                        if (data.reward ) {
                            if (script2 != null) {
                                script2.onShowHongBao(data.reward);
                            }
                        }
                       
                        cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示
                        self.onRefreshShow();//刷新本item的
    
                    }else
                    {
                        cc.showCommTip(ret.msg);
                    }
                }
            };
            var psObjdata = {
                long_id:this.data.id,
            };
            var psdata = cc.JsonToPostStr(psObjdata);
            
            if (this.zhaoHuanNum <= 0) {
    
                cc.showCommTip( "召唤次数不足！");
            }
            else{
                HttpHelper.httpPost(cc.UrlTable.url_long_summon,psdata,onPostCallBack,this);
            }

    },
    onClickHeCheng(event, customEventData){
        var self = this;
        var node = event.target;
        var curButton = node.getComponent(cc.Button);
        curButton.interactable = false;
        var loadPrefabsCallBack = function()
        {
            curButton.interactable = true;
            var perfab = cc.allViewMap[cc.PanelID.YL_TESU_HECHENG];
            var script = perfab.getComponent('hecheng');
            script.setParentScript(self);
            
        }
        cc.myShowView(cc.PanelID.YL_TESU_HECHENG,7,null,loadPrefabsCallBack);  
    },
    onClickDuiHUna(event, customEventData)//去兑换
    {
        var node = event.target;
        var curButton = node.getComponent(cc.Button);
       
        curButton.interactable = false;
        var self = this;
        var loadPrefabsCallBack = function()
        {
            curButton.interactable = true;
            var perfab = cc.allViewMap[cc.PanelID.YL_TESU_DUIHUAN];
            var script = perfab.getComponent('duihuan');
            script.setParentScript(self);
            
        }
        cc.myShowView(cc.PanelID.YL_TESU_DUIHUAN,7,null,loadPrefabsCallBack);  

    }

    // update (dt) {},
});
