
cc.Class({
    extends: cc.Component,

    properties: {
        jyNode:cc.Node,
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
        countTime:0,
        myJinYuanLabel:null,
    },
    

   

    start () {
       
        this.onRefreshUi();
       // this.onShowScroll(cc.configMgr.configMap[cc.cfg_Name.longBaseData]);
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

        var self = this;
        var delayAct = cc.delayTime(0.3);
        var seq = cc.sequence(delayAct,cc.callFunc(function(){
            self.onShowScroll(cc.configMgr.configMap[cc.cfg_Name.longBaseData]);
           })
         );
        this.node.runAction(seq)

        


        

    },
   
    onRefreshUi(){
        var myJinYuanLabel = this.jyNode.getComponent(cc.Label);//金元
        this.myJinYuanLabel = myJinYuanLabel;
        // myJinYuanLabel.string = parseInt(cc.UserInfo.diamond);
        myJinYuanLabel.string = Number(cc.UserInfo.diamond).toFixed(2);
       
    },

    onCloseBtn(){
        cc.onDestoryView(cc.PanelID.YL_LONGDIAN);
        cc.closeBannerAD(); 
    },

    onShowScroll(list){
        for (let index = 0; index < this.itemList.length; index++) {
            const item = this.itemList[index];
            if (item != null) {
                item.destroy();
            }
            
        }
        this.itemList = [];
        for (const key in list) {
            if (list.hasOwnProperty(key)) {
                const element = list[key];
             
                if (element.type == 1) {
                    var item = cc.instantiate(this.item_prefab);
                    this.itemLayoutNode.addChild(item);
                    var script = item.getComponent('longdianitem');
                    script.setShowData(element);
                    this.itemList.push(item);//保存起来
                }
            }
           
        }
      
        this.contentNode.height = this.itemList.length *190;
        // if ( this.contentNode.height < 400) {
        //     this.contentNode.height = 400;
        // }
    },
    
     update (dt) {
        if (this.countTime>=1.0) {
            if ( this.myJinYuanLabel != null) {
                this.myJinYuanLabel.string = Number(cc.UserInfo.diamond).toFixed(2);
            } 
            this.countTime = 0;
        }
        else{
            this.countTime = this.countTime + dt;
        }


     },
});
