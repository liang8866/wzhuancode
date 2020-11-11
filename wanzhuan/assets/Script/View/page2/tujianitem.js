

cc.Class({
    extends: cc.Component,

    properties: {
        
        longIconNode:cc.Node,
        nameRichTextNode: {//名字和阶级
            default: null,
            type: cc.Node
        },
        desc1LabelNode:cc.Node,
        desc2LabelNode:cc.Node,
        desc3LabelNode:cc.Node,
        desc4LabelNode:cc.Node,
      
       
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    setShowData(data){
        this.data = data;
          //---设置头像的和名字的
        var longIcon = this.longIconNode.getComponent(cc.Sprite);
        cc.setLongIcon(data.iconName,longIcon)
        this.onRefreshShow();
        
    },


    onRefreshShow(){
        var data = this.data;
       
        var nameRichText = this.nameRichTextNode.getComponent(cc.RichText);//名字
        var desc1Label = this.desc1LabelNode.getComponent(cc.Label);
        var desc2Label = this.desc2LabelNode.getComponent(cc.Label);
        var desc3Label = this.desc3LabelNode.getComponent(cc.Label);
        var desc4Label = this.desc4LabelNode.getComponent(cc.Label);
        
     
        var tujianData = cc.configMgr.getLongTuJianDataById(data.id);
        desc1Label.string = tujianData.desc1;
        desc2Label.string = tujianData.desc2;
        desc3Label.string = tujianData.desc3;
        desc4Label.string = tujianData.desc4;
        
        nameRichText.string = this.getNameRichStr(data.name,data.step);

    },

    getNameRichStr(name,step){//获取名字的richText
        var str = "<color=#F30ACE>" + name + "</c><color=#46aa26>[" + step+ "阶]</color>";
        return str;
    },

  
 
 

    // update (dt) {},
});
