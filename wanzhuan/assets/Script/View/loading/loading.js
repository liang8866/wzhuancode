
cc.Class({
    extends: cc.Component,

    properties: {
        showLabelNode: {
            default: null,
            type: cc.Node
        },
        maskLayoutNode:cc.Node,
        aniNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.showLabel =  this.showLabelNode.getComponent(cc.Label);
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.25;
            }
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*2);
        }

        var self = this;
        var  i = 0;
        // setInterval(function () {
        //     i++
        //     //cc.log("========i=",i);
        //    // self.aniNode.angle =   self.aniNode.angle +1;
        // }, 100);

    },
    setText(str) {
        this.showLabel.string = str;
    },

     update (dt) {
       // this.aniNode.angle =   this.aniNode.angle +1;
        //cc.log("===  this.aniNode.rotation=",this.aniNode.angle);

     },
});
