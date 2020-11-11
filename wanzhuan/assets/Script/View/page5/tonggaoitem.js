
cc.Class({
    extends: cc.Component,

    properties: {
     
      timeLabelNode:cc.Node,
      midLable1Node:cc.Node,
     
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
       
    },
    onSetData(data)
    {
      this.data = data;
      var timeLabel = this.timeLabelNode.getComponent(cc.Label);
      var midLablel = this.midLable1Node.getComponent(cc.Label);
      
      //timeLabel.string = cc.formatTime(data.created_at, 'Y/M/D h:m');
      var timestr = data.created_at;
      timeLabel.string =   timestr.substring(0,10) ;
      midLablel.string ="【公告】"+ data.title;

    },
    onClickBtn()
    {
     
      var self = this;
      var loadPrefabsCallBack = function()
      {
         
          var perfab = cc.allViewMap[cc.PanelID.PERSON_TONGGAODETAIL];
          var script = perfab.getComponent('tonggaodetail');
          script.onSetData(self.data);
      }

      cc.myShowView(cc.PanelID.PERSON_TONGGAODETAIL,10,null,loadPrefabsCallBack);  

    },

    // update (dt) {},
});
