
cc.Class({
    extends: cc.Component,

    properties: {
        showLabelNode: {
            default: null,
            type: cc.Node
        },
        tipLabelBg:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.tipLabelBg.active = false;
        this.showLabel =  this.showLabelNode.getComponent(cc.Label);
    },
    showTip(str){
        this.tipLabelBg.zIndex =20;
        this.tipLabelBg.active = false;
        this.showLabel.string = str;
        this.showLabelNode.stopAllActions()
        
        var showCallBack = function(self){
            self.tipLabelBg.active = false;
        }
        this.conShowTipAction( this.showLabelNode,str,showCallBack,this);
    },
      //显示提示的
    conShowTipAction(labelNode,str,callFunc,self){
        var label =  labelNode.getComponent(cc.Label);
        if (label != null) {
        label.string = str;
        }
        var delayAct0 = cc.fadeIn(0.1);
        var delayAct = cc.delayTime(2.0);
        var fadeAct = cc.fadeOut(1.0);
        var callback0 = function()
        {
            self.tipLabelBg.active = true;
        }

        var action = cc.sequence(delayAct0,cc.callFunc(callback0),delayAct,fadeAct,cc.callFunc(function(){
            if (callFunc) {
                callFunc(self);
            }
            },self)
        );

        labelNode.runAction(action)
    
    },

    // update (dt) {},
});
