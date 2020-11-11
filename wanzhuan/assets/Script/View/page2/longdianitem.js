

cc.Class({
    extends: cc.Component,

    properties: {
        nameLabelNode:cc.Node,
        jieLabelNode:cc.Node,
        longIconNode:cc.Node,
        ableBtnNode:cc.Node,
        enableBtnNode:cc.Node,
        needjinyuanLabelNode:cc.Node,
        needLongNumLableNode:cc.Node,
        tipLableNode:cc.Node,
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
            this.fag = 1;
        }
        
        this.onRefreshShow();

    },

    onRefreshShow(){
        var data = this.data;
        var nameLabel = this.nameLabelNode.getComponent(cc.Label);
        var jieLabel = this.jieLabelNode.getComponent(cc.Label);
        var needjinyuanLabel = this.needjinyuanLabelNode.getComponent(cc.Label);
        var needLongNumLable = this.needLongNumLableNode.getComponent(cc.Label);

        nameLabel.string = data.name;
        jieLabel.string = "["+ data.step +"阶]";
 
        if (cc.UserInfo.level >= data.step ) {
            this.ableBtnNode.active = true;
            this.enableBtnNode.active = false;
        }
        else
        {
            this.ableBtnNode.active = false;
            this.enableBtnNode.active = true;  
            if (data.step == (Number(cc.UserInfo.level) + 1)) {
                needLongNumLable.string = cc.UserInfo.up_num + "/"+ data.needLongNum;
            } else{
                needLongNumLable.string ="0/"+ data.needLongNum;
            }
        }

        var zNum = 0;
        var longNumData = cc.geLongNumDataById(data.id);
        if (longNumData != null) {
            zNum = parseInt(longNumData.num) ;//召唤次数
        }
        var moneyNum = Number(zNum)  * data.cost1 +Math.floor(Number(zNum)  / 10) * data.cost2 + data.cost
        needjinyuanLabel.string = moneyNum.toFixed(2);//需要金元
        this.moneyNum = moneyNum;


    },

 
    onClickZhaoHuan(){
           //请求龙的数据列表
           var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                if (ret.status == "ok") {//成功
                    var data = ret.data
                    
                    if (data.cost != null && data.cost.diamond != null) {
                        cc.UserInfo.diamond = Number(cc.UserInfo.diamond) -  Number(data.cost.diamond);//消耗了多少金币
                    }
                   
                    var item = {
                        id:data.long.id,
                        index:data.long.index,
                        level: data.long.level,
                        long_id: data.long.long_id,
                        stage:data.long.stage,
                       
                    }
                    
                    cc.UserInfo.addUserinfolong(item)
                  
                    var script2 = cc.getPageSriptByIndx(2) ;
                    if (script2 != null) {
                        script2.addOneLong(item,true);//招呼了就增加一条龙
                    }
                   
                    
                    //更新列表次数的
                    var idx = -1;
                    var array = cc.UserInfo.long_num_List;
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index];
                        if (Number(element.long_id) == Number(data.long.long_id)) {
                            idx = index;
                            break;
                        }
                    }
                    if (idx != -1) {
                        cc.UserInfo.long_num_List[idx].num = parseInt(data.long_num);
                    }else{
                        
                        //此时是没找到
                        var longnumitem = {
                            long_id: data.long.long_id,
                            num:data.long_num
                        }
                        cc.UserInfo.long_num_List.push(longnumitem);
                    }
                    
                   
                    cc.refreshMoneyShow();//刷新各个常驻页面的金钱显示
                    self.onRefreshShow();//刷新本item的
                    if (data.reward ) {
                        if (script2 != null) {
                            script2.onShowHongBao(data.reward);
                        }
                    }
                }
                else{
                   
                    cc.showCommTip(ret.msg);
                    

                }
            }
        };
        var psObjdata = {
            long_id:this.data.id,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        

        if (Number(cc.UserInfo.diamond) < this.moneyNum ) {
           
            cc.showCommTip("金元不足！");
            
        }
        else{
            HttpHelper.httpPost(cc.UrlTable.url_long_summon,psdata,onPostCallBack,this);
        }

    },

    // update (dt) {},
});
