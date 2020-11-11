//所有View的基类
var BasePanel = cc.Class({
    extends: cc.Component,
    editor: CC_EDITOR && {
        //menu: 'i18n:MAIN_MENU.component.others/SceneEntity',
        menu: 'UIPanel/BasePanel',
        //help: 'i18n:COMPONENT.help_url.animation',
        executeInEditMode: true,
    },
    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        //显示时候传递过来的
        viewData: Object,
        //显示的时候PanelMgr自动赋值
        panelID: 0,
    },

    // use this for initialization
    onLoad: function () {
        cc.log("on base panel onload...");
    },

   

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    hide: function() {
        cc.panelMgr.hideView(this.panelID);
    },

    //公用的点击事件
    onClickClose: function() {
        this.hide();
    },
});

cc.BasePanel = module.exports = BasePanel;
