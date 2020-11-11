
cc.Class({
    extends: cc.Component,

    properties: {
     
      timeLabelNode:cc.Node,
      midLablelNode1:cc.Node,
      midLable1Node2:cc.Node,
      moneyLabelNode:cc.Node,
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
       
    },
    onSetData(data)
    {
    
      var timeLabel = this.timeLabelNode.getComponent(cc.Label);
      var midLablel1 = this.midLablelNode1.getComponent(cc.Label);
      var midLable12 = this.midLable1Node2.getComponent(cc.Label);
      var moneyLabel = this.moneyLabelNode.getComponent(cc.Label);
    
      timeLabel.string =data.date;
      midLablel1.string = data.level1;
      midLable12.string = data.level2;
      var all =  Number(data.level1) + Number(data.level2)
      var allStr = all.toFixed(2)  +"元";
      moneyLabel.string =  allStr;

    }
    

    // update (dt) {},
});
