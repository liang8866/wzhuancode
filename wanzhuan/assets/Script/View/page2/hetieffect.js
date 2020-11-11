
cc.Class({
    extends: cc.Component,

    properties: {
      
        effNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var animation = this.effNode.getComponent(cc.Animation)
        animation.play('hetieffClip') // 直接播放动画
        var self = this;
        animation.endPlay = function()
        {
            if (this.callback) {
                this.callback();
            }
            this.node.destroy();
        }.bind(this);



  

    },
    
    setparentCallBack(callback)
    {
       
        this.callback =callback;
    }

    // update (dt) {},
});
