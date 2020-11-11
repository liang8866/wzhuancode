
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
            //this.scrollView.setContentSize(this.scrollView.getContentSize().width,this.scrollView.getContentSize().height + cc.iphone_off_Y*2.5);
            this.contentView.setContentSize(this.contentView.getContentSize().width,this.contentView.getContentSize().height + cc.iphone_off_Y*2.5);
            this.contentNode.setContentSize(this.contentNode.getContentSize().width,this.contentNode.getContentSize().height + cc.iphone_off_Y*2.5);
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*6);
        }
     },

    start () {
       
        var self = this;
      
        
    },
    
  

    onCloseBtn(){
        cc.onDestoryView(cc.PanelID.SY_SHOUYIDESCPAGE);
    },

    

    // update (dt) {},
});
