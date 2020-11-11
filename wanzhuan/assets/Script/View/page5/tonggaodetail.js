
cc.Class({
    extends: cc.Component,

    properties: {
        maskLayoutNode:cc.Node,
        topLayoutNode:cc.Node,
        titleLabelNode:cc.Node,
        contentLabelNode:cc.Node,
        dateLabelNode:cc.Node,
        contentViewNode:cc.Node,
        mgLayoutNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.25;
            }
           
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*8);
        }
     },

    start () {
       
      

    
     
    },

    onSetData(data){
        this.data = data;
        var dateLabel = this.dateLabelNode.getComponent(cc.Label);
        var titleLabel = this.titleLabelNode.getComponent(cc.Label);
        var contentLabel = this.contentLabelNode.getComponent(cc.Label);
        
        var timestr = data.created_at;
        dateLabel.string =   timestr.substring(0,10) ;
        titleLabel.string = data.title;
        contentLabel.string = data.content;
        
        var self = this;
        var delayCallBack = function()
        {
           
            //cc.log("====================h ", self.mgLayoutNode.getContentSize())
            self.contentViewNode.setContentSize( self.contentViewNode.getComponent.width,self.mgLayoutNode.getContentSize().height+150);
           
           
        }
        cc.PerDelayDo(this.node,delayCallBack,1.0,null);
    },
 

    onClickExit()
    {

        cc.onDestoryView(cc.PanelID.PERSON_TONGGAODETAIL); 
    }
   

    //  update (dt) {



    //  }
});
