
cc.Class({
    extends: cc.Component,

    properties: {
        activeBtnNode:cc.Node,
        imgSpriteNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
      this.clickFlag = false;
    },
    onSetData(data)
    {
      cc.log("data:",data);
      this.data = data;
    
      cc.loadUrlImg(this.imgSpriteNode.getComponent(cc.Sprite),this.data.img);

      // cc.loader.load({url:headimg,type:'jpg'},function(err,tex){
      //   container.spriteFrame = new cc.SpriteFrame(tex);
      // });
      //  var callback = function(frame)
      //   {
      //     backGround.spriteFrame =frame;
      //   }
      //   var strArr = this.data.img.split("/");
      //   cc.log("strArr ;",strArr,strArr[strArr.length-1])
      //   HttpHelper.downloadRemoteImageAndSave(this.data.img,callback,strArr[strArr.length-1]);
     

    },
    
    onClickBtn()
    {
      if (this.clickFlag == true) {
        
        return;
      }
      this.clickFlag = true;
      var self = this;
      
      var loadPrefabsCallBack = function(prefab)
      {
          self.clickFlag = false;
          var script = prefab.getComponent('showWebPage');
          script.onShowWeb(self.data.url);
      }
      cc.myShowView(cc.PanelID.COM_SHOW_WEB,7,null,loadPrefabsCallBack);

    },
    // update (dt) {},
});
