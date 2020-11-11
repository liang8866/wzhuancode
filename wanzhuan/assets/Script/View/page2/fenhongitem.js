
cc.Class({
    extends: cc.Component,

    properties: {
     
      timeLabelNode:cc.Node,
      nameLabelNode:cc.Node,
      phoneLabelNode:cc.Node,
      descLabelNode:cc.Node,
      whereLabelNode:cc.Node,
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
       
    },
    onSetData(data)
    {
    
      var timeLabel = this.timeLabelNode.getComponent(cc.Label);
      var nameLabel = this.nameLabelNode.getComponent(cc.Label);
      var phoneLabel = this.phoneLabelNode.getComponent(cc.Label);
      var descLabel = this.descLabelNode.getComponent(cc.Label);
      var whereLabel = this.whereLabelNode.getComponent(cc.Label);
    
      timeLabel.string = cc.formatTime(data.created_at,'Y-M-D h:m:s');
      phoneLabel.string = data.account;
      nameLabel.string = data.name;
      if ( Number.parseInt(data.type)  == 1) {
        whereLabel.string = "必得永久分红卡";
      }
      else if(Number.parseInt(data.type)  == 1)  {
        whereLabel.string = "魔龙合体";

      }
      
      
    }
    

    // update (dt) {},
});
