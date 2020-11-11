
cc.Class({
    extends: cc.Component,

    properties: {
      iconNode:cc.Node,
      nameLabelNode:cc.Node,
    
      moneyLabelNode:cc.Node,
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
       
    },
    onSetData(data)
    {
      if (data == null) {
        
        return;
      }
    
      var nameLabel = this.nameLabelNode.getComponent(cc.Label);
      var moneyLabel = this.moneyLabelNode.getComponent(cc.Label);
      nameLabel.string = data.nickname;
      moneyLabel.string = data.invite_rmb;
      var headSp =   this.iconNode.getComponent(cc.Sprite); 
                 
      cc.loadUrlImg(headSp,data.head);//加载图像
    
     
    }
    

    // update (dt) {},
});
