
cc.Class({
    extends: cc.Component,

    properties: {
      descLabelNode:cc.Node,
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
      var descLabel = this.descLabelNode.getComponent(cc.Label);
      var timeLabel = this.timeLabelNode.getComponent(cc.Label);
      var midLablel1 = this.midLablelNode1.getComponent(cc.Label);
      var midLable12 = this.midLable1Node2.getComponent(cc.Label);
      var moneyLabel = this.moneyLabelNode.getComponent(cc.Label);
      midLablel1.string = ""
      midLable12.string = ""
     // cc.log(data);
      var maindesStrList = {
        1:"福树包瞬间完成",
        2:"提现至微信",
        3:"猜一猜(现金奖励)",
        4:"猜一猜(现金奖励)",
        5:"首次招龙红包",
        6:"魔龙合体",
        7:"元素之龙合成保护",
        8:"幸运转盘(抽奖)",
        9:"永久分红卡-分红",
        10:"单次分红卡-分红",
        11:"元素之龙合体",
        12:"四象守护龙合体",
        13:"玩赚队伍收益",
        14:"签到获得",
        15:"等级奖励",
        16:"新用户奖励",
        17:"累积收益转入",
        18:"福树红包",
        19:"百万扶持",
      };
      var type = Number(data.type);
    
      var desStr = maindesStrList[type];
      if ( maindesStrList[type] == null) {
          desStr = "";
      }
      descLabel.string = desStr;

      timeLabel.string = cc.formatTime(data.created_at, 'Y/M/D h:m');
      moneyLabel.string = data.num + "元";
      if (Number.parseFloat(data.num) > 0) {
          this.moneyLabelNode.color = cc.redColor;
       
      }
      else{
        this.moneyLabelNode.color =  cc.greenColor;
      }
      var tag = Number(data.tag);
     
      if (type == 2) {
         
          if (tag == 0) {
            //midLable12.string = "审核中"
            desStr = desStr +"(审核中)";
          }else if(tag = 1){
           // midLable12.string = "审核成功"
           desStr = desStr +"(审核成功)";
          }
          else if(tag = 99){
            //midLable12.string = "审核失败"
            desStr = desStr +"(审核中)";
          }
          descLabel.string = desStr;
         // this.midLable1Node2.y =  this.midLable1Node2.y +20;
      }
      if (type == 5) {
        
          // midLablel1.string = (tag -1) + "阶";
          descLabel.string =  desStr + "(" + (tag ) + "阶)";
          //this.midLable1Node2.y =  this.midLable1Node2.y +20;
      }

   
    // const CostJiasu         = 1; //福树包瞬间完成
    // const Cash              = 2; //提现至微信 - tag
    // const GuessFrist        = 3; //首次猜宝箱
    // const Guess             = 4; //猜一猜(现金奖励)
    // const Summon            = 5; //首次招龙红包 - tag
    // const Merge             = 6; //27级龙合体(现金奖励)
    // const MergeElement      = 7; //元素之龙合成保护
    // const ZhuanPan          = 8; //幸运转盘(抽奖))
    // const PermanentBonus    = 9; //永久分红卡-分红
    // const TempBonus         = 10; //单词分红卡-分红
    // const Merge1            = 11; //元素之龙合体
    // const Merge2            = 12; //四象守护龙合体
    // const Invite            = 13; //玩赚队伍收益
    //tag，只有type等于2，5的时候用到用来显示状态的， 5:直接显示({tag}阶),  2: 0审核中，1审核成功，99审核失败
    }
    

    // update (dt) {},
});
