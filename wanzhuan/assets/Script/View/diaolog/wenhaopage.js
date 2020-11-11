
cc.Class({
    extends: cc.Component,

    properties: {
        
        wenhaodanciNode:cc.Node,
        yongjiuNode:cc.Node,
        diaologbgNode1:cc.Node,
        diaologbgNode2:cc.Node,

        p2_desc1:cc.Node,
      
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        

       
    },


    onShowUi(tp)
    {
        this.diaologbgNode1.active = true;
        this.diaologbgNode2.active = false;
        this.wenhaodanciNode.active = false;
        this.yongjiuNode.active = false;
        if (tp == 1) {// 单次的显示
            this.wenhaodanciNode.active = true;
        }
        else if (tp == 2) {//永久的显示
            this.yongjiuNode.active = true;
        }

    },

   onShouYiShow(tp){
    this.diaologbgNode2.active = true;
    this.diaologbgNode1.active = false;
    this.p2_desc1.active = false;

    if (tp == 1) {
        this.p2_desc1.active = true;
    }
    else if (tp == 2) {
        this.p2_desc2.active = true;
    }

},


    onClickComfirm()
    {
        cc.onDestoryView(cc.PanelID.COM_WENHAOPAGE);
    },
});
