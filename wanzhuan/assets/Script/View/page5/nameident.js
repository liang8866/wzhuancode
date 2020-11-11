
cc.Class({
    extends: cc.Component,

    properties: {
       
       maskLayoutNode:cc.Node,
       topLayoutNode:cc.Node,
       downLayoutNode:cc.Node,
       downLayoutNode0:cc.Node,
       nameLabelNode:cc.Node,
       identCodeLabelNode:cc.Node,
       zhifubaoLableNode:cc.Node,
       faildescLabelNode:cc.Node,
       descLabelNode:cc.Node,
       againBtnNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.25;
            }
            this.topLayoutNode.y = this.topLayoutNode.y +cc.iphone_off_Y*2.0;
            this.downLayoutNode.y = this.downLayoutNode.y +cc.iphone_off_Y*2.0;
            this.downLayoutNode0.y = this.downLayoutNode0.y +cc.iphone_off_Y*2.0;
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*6);
        }

     },

    start () {
      this.name = "";
      this.identCode = "";
      this.zhifubao = "";
      this.downLayoutNode.active = false;
      this.downLayoutNode0.active = false;
      

      this.nameLabel = this.nameLabelNode.getComponent(cc.Label);
      this.identCodeLabel = this.identCodeLabelNode.getComponent(cc.Label);
      this.zhifubaoLable = this.zhifubaoLableNode.getComponent(cc.Label);
      this.faildescLabel = this.faildescLabelNode.getComponent(cc.Label);
      this.descLabel = this.descLabelNode.getComponent(cc.Label);

      this.againBtn = this.againBtnNode.getComponent(cc.Button);
    },
    onPostToGetData(pScript)
    {
        this.pScript = pScript;
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
              
                if (ret.status == "ok") {//
                    cc.log("url_ident_data====",ret);
                    
                    self.onShowLayer(ret);

                }
                else{
                    //cc.showCommTip(ret.msg);
                }
            }
        };
        var psObjdata = {
           
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_ident_data,psdata,onPostCallBack,this);
    },

    onShowLayer(ret)
    {
        var  data = ret.data;
        //状态: 0未提交数据，90:审核中, 2:审核失败，1:审核成功
        var result = Number.parseInt(data.ident);
        cc.UserInfo.ident = result; 
        if (this.pScript) {
            this.pScript.refreshRenZhengTip()
        }
        if ( result == 0) {
            this.downLayoutNode.active = true;
        }
        else if(result == 1){
            this.downLayoutNode0.active = true;
            this.againBtnNode.active = false;
            this.faildescLabelNode.active = false;
            this.nameLabel.string = "身份证名字："+data.name;
            this.identCodeLabel.string  ="身份证证号码："+ data.card_no;
            this.zhifubaoLable.string  = "支付宝账号："+ data.alipay;
            this.faildescLabel.string = "";
            this.descLabel.string = data.updated_at + "  审核成功"
        }
        else if(result == 2)
        {
            this.downLayoutNode0.active = true;
            this.againBtnNode.active = true;
            this.faildescLabelNode.active = true;
            this.descLabelNode.active = false;
            this.nameLabel.string = "身份证名字："+data.name;
            this.identCodeLabel.string  ="身份证证号码："+ data.card_no;
            this.zhifubaoLable.string  = "支付宝账号："+data.alipay;
            this.faildescLabel.string = data.updated_at + "  验证失败";
            this.descLabel.string ="原因："+ ret.msg;
        }
        else{
            this.downLayoutNode0.active = true;
            this.downLayoutNode.active = false;
            this.againBtnNode.active = false;
            this.faildescLabelNode.active = false;
            this.nameLabel.string = "身份证名字："+data.name;
            this.identCodeLabel.string  ="身份证证号码："+ data.card_no;
            this.zhifubaoLable.string  = "支付宝账号："+data.alipay;
            this.faildescLabel.string = "";
            if ( data.updated_at != null) {
                this.descLabel.string = data.updated_at +  "  审核中，请耐心等候！"
            }
            else{
                this.descLabel.string ="  审核中，请耐心等候！"
            }
          

        }


    },

    onClickBack(){
        cc.onDestoryView(cc.PanelID.PERSON_IDNET);

    },
    onClickAgainBtn()//从新验证
    {
        this.downLayoutNode0.active = false;
        this.downLayoutNode.active = true;

    },
    onClcikComfirm()
    {
        cc.myShowView(cc.PanelID.LOADING_PAGE,10);
    
        
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log(" url_submit_ident ",ret)
                if (ret.status == "ok") {//成功
                    
                    self.onShowLayer(ret);
                   
                }else
                {
                    cc.showCommTip(ret.msg);
                   
                }
                cc.myHideView(cc.PanelID.LOADING_PAGE);
            }
        };
        var psObjdata = {
            card_no:this.identCode,
            name:this.name ,
            alipay:this.zhifubao,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_submit_ident,psdata,onPostCallBack,this);

    },
    onEditDidBegan: function(editbox, customEventData) {
        if (customEventData == 1 ) {//名字
            this.name ="";
        }else if(customEventData == 2) {//身份证
          this.identCode = "";
        }
        else if(customEventData == 3) {//支付宝
            this.zhifubao = "";
        }
    },
    // 假设这个回调是给 editingDidEnded 事件的
    onEditDidEnded: function(editbox, customEventData) {
        var str = editbox.string;
      
        if (customEventData == 1 ) {//名字
            this.name =str;
        }else if(customEventData == 2) {//身份证
          this.identCode = str;
        }
        else if(customEventData == 3) {//支付宝
            this.zhifubao = str;
        }
       
        
    },
    // 假设这个回调是给 textChanged 事件的
    onTextChanged: function(text, editbox, customEventData) {
     
    },
    // 假设这个回调是给 editingReturn 事件的
    onEditingReturn: function(editbox,  customEventData) {
      
    },
  
    


    // update (dt) {},
});
