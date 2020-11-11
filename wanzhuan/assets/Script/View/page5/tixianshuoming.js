
cc.Class({
    extends: cc.Component,

    properties: {
       
       maskLayoutNode:cc.Node,
       topLayoutNode:cc.Node,
       downLayoutNode:cc.Node,
    
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
    
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*6);
        }

     },

    start () {
  
      

    },
    
  
    onClickBack(){
       
        cc.onDestoryView(cc.PanelID.PERSON_TIXIANSHUOMING);
    },
   
    


    // update (dt) {},
});
