
cc.Class({
    extends: cc.Component,

    properties: {
     
      timeLabelNode:cc.Node,
      midLable1Node:cc.Node,
      phoneNumLabelNode:cc.Node,
      youxiaoNode:cc.Node,
      wuxiaoNode:cc.Node,
      timeLabelNode2:cc.Node,
      headIconNode:cc.Node,
      nickNameNode:cc.Node,
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
       
    },
    onSetData(data)
    {
    
      var timeLabel = this.timeLabelNode.getComponent(cc.Label);
      var timeLabel2 = this.timeLabelNode2.getComponent(cc.Label);
      var midLablel = this.midLable1Node.getComponent(cc.Label);
      var phoneNumLabel = this.phoneNumLabelNode.getComponent(cc.Label);
      var nickNameLabel = this.nickNameNode.getComponent(cc.Label);
      var nickname = data.nickname.slice(0,8);
      nickNameLabel.string = nickname;
    
      var mobileStr = data.mobile +"";
      // if (mobileStr != null || mobileStr != "") {
      //     mobileStr = mobileStr.substring(0,3)+ "****" + mobileStr.substring(7);
      // }
      phoneNumLabel.string = mobileStr;
      timeLabel.string = cc.formatTime(data.created_at, 'Y/M/D h:m');
      timeLabel2.string = cc.formatTime(data.created_at, 'Y/M/D h:m');
      midLablel.string =  data.level+"阶";
      if (data.ident) {//徒弟
          this.wuxiaoNode.active = false;
          this.youxiaoNode.active = false;
          if (Number.parseInt(data.ident) == 1 && Number.parseInt(data.level) >= 5) {
             this.youxiaoNode.active = true;
          }else{
             this.wuxiaoNode.active = true;
          }
          this.timeLabelNode.active = true;
          this.timeLabelNode2.active = false;
      }else{//徒孙的
          this.wuxiaoNode.active = false;
          this.youxiaoNode.active = false;
          this.timeLabelNode.active = false;
          this.timeLabelNode2.active = true;
      }
      if(data.head != "")
      {
          var headSp =   this.headIconNode.getComponent(cc.Sprite);  
          cc.loadUrlImg(headSp,data.head);//加载图像
      }
      

    }
    

    // update (dt) {},
});
