
cc.Class({
    extends: cc.Component,

    properties: {
        
        maskLayoutNode:cc.Node,
        topLayoutNode:cc.Node,
        downLayoutNode:cc.Node,

        itemLayoutNode: { 
            default: null,
            type: cc.Node
        },
        item_prefab:{  //项的资源预制体
            type:cc.Prefab,
            default:null,
        },
        contentNode:{
            default: null,
            type: cc.Node
        },
        contentView:{
            default: null,
            type: cc.Node
        },
        scrollView:{
            default: null,
            type: cc.Node
        },
        allItemList:[],
        
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.dowmHeight = 1180;
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.35;
            }
            this.topLayoutNode.y = this.topLayoutNode.y +cc.iphone_off_Y*2.0;
            this.downLayoutNode.y = this.downLayoutNode.y +cc.iphone_off_Y*1.0;
            this.dowmHeight = 1180 + cc.iphone_off_Y*2.5;
            this.scrollView.setContentSize(this.scrollView.getContentSize().width,this.scrollView.getContentSize().height + cc.iphone_off_Y*2.5);
            this.contentView.setContentSize(this.contentView.getContentSize().width,this.contentView.getContentSize().height + cc.iphone_off_Y*2.5);
            this.contentNode.setContentSize(this.contentNode.getContentSize().width,this.contentNode.getContentSize().height + cc.iphone_off_Y*2.5);
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*6);
        }
     },

    start () {
       
        var self = this;
        var delayAct = cc.delayTime(0.1);
        var seq = cc.sequence(delayAct,cc.callFunc(function(){
            self.onPostGetdata()
           })
         );
        this.node.runAction(seq)
        
    },
    
    onPostGetdata()
    {

        for (let index = 0; index < this.allItemList.length; index++) {
            const element = this.allItemList[index];
            element.destroy();            
        }
        this.allItemList = [];

        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
              
                if (ret.status == "ok") {//
                    cc.log("url_yl_profit_actives====",ret);
                    var data = ret.data;
                  
                    self.onShowLogLayout(data)
                }
                else{
                  
                }
            }
        };
        var psObjdata = {
           
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_yl_profit_actives,psdata,onPostCallBack,this);

    },

    onCloseBtn(){
        cc.onDestoryView(cc.PanelID.YL_WZACTIVE);
    },

    onShowLogLayout(list)
    {
        
        for (const key in list) {
            if (list.hasOwnProperty(key)) {
                const element = list[key];
              
                var item = cc.instantiate(this.item_prefab);
                this.itemLayoutNode.addChild(item);
                var script = item.getComponent('wzActiveitem');
                script.onSetData(element);
                this.allItemList.push(item);
            }
        }
     
        this.contentNode.height = this.allItemList.length *103;
        if ( this.contentNode.height <  this.dowmHeight) {
            this.contentNode.height =  this.dowmHeight;
        }
    },

    // update (dt) {},
});
