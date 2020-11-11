
cc.Class({
    extends: cc.Component,

    properties: {
        topLayoutNode:cc.Node,
        topLayoutNode2:cc.Node,
        maskLayoutNode:cc.Node,
        editboxParentNode:cc.Node,
        codeText:"",
        wetchat_mp_node:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.35;
            }
            this.topLayoutNode.y = this.topLayoutNode.y +cc.iphone_off_Y*2.0;
            this.topLayoutNode2.y = this.topLayoutNode2.y +cc.iphone_off_Y*2.0;
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*6);
        }
     },

    start () {
      
       
        
        // for (let i = 1; i <= 6; i++) {
        //     var editboxNode = cc.UITools.findNode(this.editboxParentNode,"EditBox"+i);
        //     var editbox = editboxNode.getComponent(cc.EditBox);
        //     editbox.enabled  = false;
            
        // }
        this.getWetchaMapPost();
       


    },


    onDestroy () {
        
    },
    setEdiboxEnabled(idx){
        for (let i = 1; i <= 6; i++) {
            var editboxNode = cc.UITools.findNode(this.editboxParentNode,"EditBox"+i);
            var editbox = editboxNode.getComponent(cc.EditBox);
            editbox.enabled  = false;
            if (idx == i) {
                editbox.enabled  = true;
                editbox.focus()//设置焦点
            }
            
        }
    },

    onEditDidBegan: function(editbox, customEventData) {
        var str = editbox.string;
      
        cc.log(customEventData +"  onEditDidBegan = ",str);
        if (customEventData == 1 ) {
            
        }else if(customEventData == 2) {
          
        }
        else if(customEventData == 3) {
           
        }
        else if(customEventData == 4) {
            
        }
        else if(customEventData == 5) {
            
        }
        else if(customEventData == 6) {
            
        }
    },
    // 假设这个回调是给 editingDidEnded 事件的
    onEditDidEnded: function(editbox, customEventData) {
        var str = editbox.string;
        this.codeText = str;
        cc.log(customEventData +"  onEditDidEnded = ",str);
        if (customEventData == 1 ) {
            
        }else if(customEventData == 2) {
          
        }
        else if(customEventData == 3) {
           
        }
        else if(customEventData == 4) {
            
        }
        else if(customEventData == 5) {
            
        }
        else if(customEventData == 6) {
            
        }
        
    },
    // 假设这个回调是给 textChanged 事件的
    onTextChanged: function(text, editbox, customEventData) {
        var str = text;
        cc.log(customEventData +"  onTextChanged = ",str);
         
        if (customEventData == 1 ) {
            
        }else if(customEventData == 2) {
          
        }
        else if(customEventData == 3) {
           
        }
        else if(customEventData == 4) {
            
        }
        else if(customEventData == 5) {
            
        }
        else if(customEventData == 6) {
            
        }
    },
    // 假设这个回调是给 editingReturn 事件的
    onEditingReturn: function(editbox,  customEventData) {
        var str = editbox.string;
        cc.log(customEventData +"  onEditingReturn = ",str);
        if (customEventData == 1 ) {
            
        }else if(customEventData == 2) {
          
        }
        else if(customEventData == 3) {
           
        }
        else if(customEventData == 4) {
            
        }
        else if(customEventData == 5) {
            
        }
        else if(customEventData == 6) {
            
        }
    },

    onClickBack()
    {
        cc.onDestoryView(cc.PanelID.SY_GUANZHU);

    },
    onClickComfirm(){

        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("onClickComfirm  ret= ",ret);
                if (ret.status == "ok") {//成功
                    var data = ret.data
                
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

                    cc.UserInfo.follow_mp  = data.follow_mp;
                    var script = cc.getPageSriptByIndx(5);
                    script.onShowfollowMp()
                    cc.showCommTip("绑定成功");
                    cc.onDestoryView(cc.PanelID.SY_GUANZHU);
                }else{
                    cc.showCommTip( ret.msg);
                }
            }

        }


        var psObjdata = {
            code:this.codeText,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_sy_mp_code,psdata,onPostCallBack,this);

    },
  
    getWetchaMapPost()
    {
       var wetchat_mp_Label = this.wetchat_mp_node.getComponent(cc.Label);
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("getWetchaMapPost  ret= ",ret);
                if (ret.status == "ok") {//成功
                    var data = ret.data
                    wetchat_mp_Label.string ="①:在微信--公众号中搜索 “"+data.wechat_mp + "” 并关注它"
                   
                }else{
                    // cc.showCommTip( ret.msg);
                }
            }

        }

        var psObjdata = {
            
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_get_wetchat_mp,psdata,onPostCallBack,this);
    },
        
    // update (dt) {},
});
