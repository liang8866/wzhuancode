
cc.Class({
    extends: cc.Component,

    properties: {
     
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
        richText.string = this.getRichString(itemdata);
       
    },
// 名字颜色，紫色。  #e906fd
// 内容颜色，黑色带点灰色。  #434243
// RMB颜色，金黄色。   #fdd102
// 金元颜色，绿色。    #2fbe46

   getRichString(itemdata){
    // 0: {id: "10", nickname: "海哥", amount: "17.50", type: "1", created_at: "1568635752"}
            //	1:金元，2:人民币元
        if (itemdata == null) {
          return "";
        }
        var nickname = itemdata.nickname.slice(0,8)
        var text = "<color=#FA051C>运气爆棚，</c>" +"<color=#FF09F5>"+ nickname + "</c><color=#FA051C>在偷取福包中，获得超级现金 </c>";
        
        text = text + "<color=#2fbe46>"+ itemdata.amount+ "元</color>";
        
        return text;
    },
    // update (dt) {},
});
