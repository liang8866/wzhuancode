
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        richTextNode:{
            default: null,
            type: cc.Node
        },
        timeTextNode:{
            default: null,
            type: cc.Node
        }

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },
    showUi(itemdata){
        var richText = this.richTextNode.getComponent(cc.RichText);
        var timeText =  this.timeTextNode.getComponent(cc.Label);
        richText.string = cc.getGgRichString(itemdata);
        timeText.string = cc.formatTime(itemdata.created_at, 'Y/M/D');
    },

    // update (dt) {},
});
