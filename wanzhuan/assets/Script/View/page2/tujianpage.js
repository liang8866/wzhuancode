
cc.Class({
    extends: cc.Component,

    properties: {
       
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
     
        itemList:[],
        fag:0,
    },
    

    onLoad () {
       
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

    start () {
      
        var self = this;
        var delayAct = cc.delayTime(0.3);
        var seq = cc.sequence(delayAct,cc.callFunc(function(){
            self.onShowScroll(cc.configMgr.configMap[cc.cfg_Name.longBaseData]);
           })
         );
        this.node.runAction(seq)
    },
  

    onCloseBtn(){
        cc.onDestoryView(cc.PanelID.YL_TUJIAN);
    },

    onShowScroll(list){
        if (this.fag == 1) {
            
            return;
        }
        this.fag  = 1;
        for (const key in list) {
            if (list.hasOwnProperty(key)) {
                const element = list[key];
                if (element.type == 1) {
                    var item = cc.instantiate(this.item_prefab);
                    this.itemLayoutNode.addChild(item);
                    var script = item.getComponent('tujianitem');
                    script.setShowData(element);
                    this.itemList.push(item);//保存起来
                }
            }
           
        }
      
        this.contentNode.height = this.itemList.length *220;
        if ( this.contentNode.height < 900) {
            this.contentNode.height = 900;
        }
       
    },
    
    // update (dt) {},
});
