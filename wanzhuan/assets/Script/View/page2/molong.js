
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
    },
    

    onLoad () {
       
       
     },

    start () {
      
       
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.25;
            }
            var masklayout = cc.UITools.findNode(this.node,"masklayout");
            if (masklayout != null) {
                masklayout.scale = 1.25;
            }
        }

        var self = this;
        var delayAct = cc.delayTime(0.3);
        var seq = cc.sequence(delayAct,cc.callFunc(function(){
            self.onShowScroll(cc.configMgr.configMap[cc.cfg_Name.longBaseData]);
           })
         );
        this.node.runAction(seq)
    },
  

    onCloseBtn(){
        cc.onDestoryView(cc.PanelID.YL_TESUMOLONG);
    },

    onShowScroll(list){
        for (let index = 0; index < this.itemList.length; index++) {
            const element = this.itemList[index];
          
            if (element != null) {
                element.destroy();
            }
        }
        this.itemList = [];

        for (const key in list) {
            if (list.hasOwnProperty(key)) {
                const element = list[key];
             
                if (element.type != 1) {
                    var item = cc.instantiate(this.item_prefab);
                    this.itemLayoutNode.addChild(item);
                    var script = item.getComponent('molongitem');
                    script.setShowData(element);
                    this.itemList.push(item);//保存起来
                }
            }
           
        }
      
        this.contentNode.height = this.itemList.length *300;
        if ( this.contentNode.height < 900) {
            this.contentNode.height = 900;
        }
       
    },
    
    // update (dt) {},
});
