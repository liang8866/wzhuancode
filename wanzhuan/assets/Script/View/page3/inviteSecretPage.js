
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
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.35;
            }
            this.topLayoutNode.y = this.topLayoutNode.y +cc.iphone_off_Y*2.0;
            this.downLayoutNode.y = this.downLayoutNode.y +cc.iphone_off_Y*0.5;
           // this.downLayoutNode.setContentSize(this.downLayoutNode.getContentSize().width,this.downLayoutNode.getContentSize().height + cc.iphone_off_Y*4);
            this.scrollView.setContentSize(this.scrollView.getContentSize().width,this.scrollView.getContentSize().height + cc.iphone_off_Y*4);
            this.contentView.setContentSize(this.contentView.getContentSize().width,this.contentView.getContentSize().height + cc.iphone_off_Y*4);
            this.contentNode.setContentSize(this.contentNode.getContentSize().width,this.contentNode.getContentSize().height + cc.iphone_off_Y*4);
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*6);
            this.contentView.y = this.contentView.y - cc.iphone_off_Y*0.5;
        }
     },

    start () {
        

       
    },
   

    onClickComfirm()
    {
        cc.onDestoryView(cc.PanelID.SY_INVITSECRETPAGE);
    },
});
