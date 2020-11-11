
cc.Class({
    extends: cc.Component,

    properties: {
        maskLayoutNode:cc.Node,
        topLayoutNode:cc.Node,
        topLayoutNode2:cc.Node,
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
        scrollView:{
            default: null,
            type: cc.Node
        },
        contentView:{
            default: null,
            type: cc.Node
        },
        allItemList:[],
        curPage:1,
        pageCount:1,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.3;
            }
            this.topLayoutNode.y = this.topLayoutNode.y +cc.iphone_off_Y*2.0;
            this.topLayoutNode2.y = this.topLayoutNode2.y +cc.iphone_off_Y*2.0;
            this.downLayoutNode.y = this.downLayoutNode.y +cc.iphone_off_Y*1.0;
           // this.downLayoutNode.setContentSize(this.downLayoutNode.getContentSize().width,this.downLayoutNode.getContentSize().height + cc.iphone_off_Y*4);
            this.scrollView.setContentSize(this.scrollView.getContentSize().width,this.scrollView.getContentSize().height + cc.iphone_off_Y*2.5);
            this.contentView.setContentSize(this.contentView.getContentSize().width,this.contentView.getContentSize().height + cc.iphone_off_Y*2.5);
            this.contentNode.setContentSize(this.contentNode.getContentSize().width,this.contentNode.getContentSize().height + cc.iphone_off_Y*2.5);
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*6);
        }

     },

    start () {
       
       
        this.onPostGetLog()
    
      
    },


    onPostGetLog()
    {
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
              
                if (ret.status == "ok") {//成功,弹出获得物品
                   // cc.log("url_sy_profit_log====",ret);
                    var data = ret.data;
                    self.onShowLogLayout(data.list);
                     
                     
                    self.curPage =  self.curPage +1;
                    self.pageCount = data.page_count
                }
                else{
                  
                }
            }
        };
        var psObjdata = {
            page:this.curPage,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(cc.UrlTable.url_sy_profit_log,psdata,onPostCallBack,this);

    },
    onShowLogLayout(list)
    {
     
    
        for (const key in list) {
            if (list.hasOwnProperty(key)) {
                const element = list[key];
              
                var item = cc.instantiate(this.item_prefab);
                this.itemLayoutNode.addChild(item);
                var script = item.getComponent('shouyilogitem');
                script.onSetData(element);
                this.allItemList.push(item);
            }
        }
     
        this.contentNode.height = this.allItemList.length *83;
        if ( this.contentNode.height < (1080 +cc.iphone_off_Y*3)) {
            this.contentNode.height = 1080 +cc.iphone_off_Y*3;
        }
    },
    scrollcallback(scrollview, eventType, customEventData) {
        //这里 scrollview 是一个 Scrollview 组件对象实例
        //这里的 eventType === cc.ScrollView.EventType enum 里面的值
        //这里的 customEventData 参数就等于你之前设置的 "foobar"
        //https://github.com/cocos-creator/engine/blob/e222465ce8426e5cf32052e4f37701f3a529ed18/cocos2d/core/components/CCScrollView.js#L59
        if (eventType == cc.ScrollView.EventType.BOUNCE_BOTTOM) {
          
            if (this.curPage< this.pageCount ) {
                this.onPostGetMoneyLog();
            }else{
                cc.showCommTip("已到尾页");
            }
           
        }
        //console.log(eventType);
    },
    onClickExit()
    {

        cc.onDestoryView(cc.PanelID.SY_LOGPAGE); 
    }
   

    // update (dt) {},
});
