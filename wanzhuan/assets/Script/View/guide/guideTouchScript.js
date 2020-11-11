
cc.Class({
    extends: cc.Component,

    properties: {
       guideTouchNode:cc.Node,
       guidePoint:cc.Node,
       guide_descNode:cc.Node,
       guidePoint2:cc.Node,
       guidePoint3:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    
    start () {
        /*1 点击可收取红包  2点击开红包  3点击关闭详细红包 4 点击偷红包 5提示点击返回家 刷新  偷取 6点击主按钮进入养龙页面 7引导点击招龙
        8 升级龙1  9点击升级龙2 10拖动2条龙合成
        
        */
       
        this.stepList ={
           1: {gPos:cc.v2(321,1020),gSize:cc.v2(100,100),figerPos:cc.v2(390,955),figerRotate:0,desPos:cc.v2(360,537),desVis:true,masktype:cc.Mask.Type.ELLIPSE },
           2: {gPos:cc.v2(360,640),gSize:cc.v2(110,110),figerPos:cc.v2(423,597),figerRotate:20,desPos:cc.v2(360,537),desVis:false,masktype:cc.Mask.Type.ELLIPSE  },
           3: {gPos:cc.v2(46,1218),gSize:cc.v2(80,80),figerPos:cc.v2(121,1158),figerRotate:20,desPos:cc.v2(360,537),desVis:false,masktype:cc.Mask.Type.ELLIPSE  },
           4: {gPos:cc.v2(120,542),gSize:cc.v2(120,120),figerPos:cc.v2(190,477),figerRotate:0,desPos:cc.v2(360,300),desVis:true,masktype:cc.Mask.Type.ELLIPSE  },
           5: {gPos:cc.v2(-100,546),gSize:cc.v2(120,120),figerPos:cc.v2(425,1091),figerRotate:-60,desPos:cc.v2(360,545),desVis:true,masktype:cc.Mask.Type.ELLIPSE  },
           6: {gPos:cc.v2(288,56),gSize:cc.v2(100,100),figerPos:cc.v2(312,113),figerRotate:90,desPos:cc.v2(320,295),desVis:true,masktype:cc.Mask.Type.ELLIPSE  },
           7: {gPos:cc.v2(360,165),gSize:cc.v2(220,100),figerPos:cc.v2(457,245),figerRotate:110,desPos:cc.v2(360,432),desVis:true,masktype:cc.Mask.Type.RECT  },
           8: {gPos:cc.v2(96,711),gSize:cc.v2(120,120),figerPos:cc.v2(155,627),figerRotate:0,desPos:cc.v2(360,432),desVis:true,masktype:cc.Mask.Type.ELLIPSE  },
           9: {gPos:cc.v2(278,711),gSize:cc.v2(120,120),figerPos:cc.v2(340,627),figerRotate:0,desPos:cc.v2(360,432),desVis:true,masktype:cc.Mask.Type.ELLIPSE  },
           10:{gPos:cc.v2(189,700),gSize:cc.v2(320,150),figerPos:cc.v2(208,573),figerRotate:0,desPos:cc.v2(360,945),desVis:true,masktype:cc.Mask.Type.RECT  },
        }

        this.curIndx =1;
       // mask.type = cc.Mask.Type.RECT;

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBg, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.onRefreshShow();
    },

    onRefreshShow()
    {
        if (this.curIndx >= 11) {
            
            this.onHidePgae();
            var delayCallBack = function()
            {
                cc.onDestoryView(cc.PanelID.GUIDE_MAINPAGE);
                cc.myShowView(cc.PanelID.GUIDE_SHOWINVITEPAGE,5,null,null);
            }
            cc.PerDelayDo(cc.rootpanel,delayCallBack,0.5,null);
            return;
        }

        if ( this.curIndx <=10) {
                
            var Data = this.stepList[this.curIndx];
            //圈的
            this.guideTouchNode.position = Data.gPos;//设置圈的位置
            var gSize = Data.gSize;
            this.guideTouchNode.active = true;
            this.guideTouchNode.setContentSize(gSize.x,gSize.y);//设置圈的大小
            var maskNode = this.guideTouchNode.getComponent(cc.Mask);//获取mask
            maskNode.type = Data.masktype;//设置mask类型

            //手指的
            this.guidePoint.position = Data.figerPos;//设置手指的位置
            this.guidePoint.active = true;
            this.guidePoint.angle = Data.figerRotate;//设置角度
            //cc.log("===========1=============",this.guidePoint.position,this.curIndx,cc.getIsIphoneX(), this.guideTouchNode.position)
            if (cc.getIsIphoneX() == true  ) {
               
                if (this.curIndx == 6) {
                    this.guideTouchNode.y =  Data.gPos.y - cc.iphone_off_Y*2;
                    this.guidePoint.y =   Data.figerPos.y - cc.iphone_off_Y*2;
                }
                else if (this.curIndx == 7) {
                    this.guideTouchNode.y =  Data.gPos.y - cc.iphone_off_Y/2;
                    this.guidePoint.y =   Data.figerPos.y - cc.iphone_off_Y/2;
                }
            }
           // cc.log("==========2==============",this.guidePoint.position,this.curIndx, this.guideTouchNode.position)
            if (this.curIndx == 5) {
                this.guidePoint2.active = true;
                this.guidePoint3.active = true;

                //6秒后进入下一步
                var delayAct = cc.delayTime(6);
                var self = this;
              
                var seq = cc.sequence(delayAct,cc.callFunc(function(){
                    self.curIndx = self.curIndx +1;
                    self.onRefreshShow();
                   })
                 );
                 this.node.runAction(seq)


            }else{
                this.guidePoint2.active = false;
                this.guidePoint3.active = false;
            }

            //描述的
            this.guide_descNode.position = Data.desPos;
            this.guide_descNode.active = Data.desVis;
            for (let index = 1; index < 11; index++) {
                var richNode = cc.UITools.findNode(this.guide_descNode,"descRichText"+index);
                if (richNode) {
                    richNode.active = false;
                } 
            }

            var richNode = cc.UITools.findNode(this.guide_descNode,"descRichText"+this.curIndx);
            if (richNode) {
                richNode.active = true;
            }

        }

    },

    onTouchBg(event) {
        let point = event.getLocation();
        let pos = this.guideTouchNode.position;
        var  fag = false;
        if ( this.curIndx <=10) {
            var Data = this.stepList[this.curIndx];
            var w = Data.gSize.x;
            var h = Data.gSize.y;
            if (Data.masktype == cc.Mask.Type.ELLIPSE ) {
                var r = w/2;
                var x1 = (point.x-pos.x);
                var y1= (point.y-pos.y);
                var len = Math.sqrt(x1*x1+y1*y1);
              //  cc.log("========r",r,len);
                if (len< r) {
                    fag = true;
                }
                //cc.log("========r",r,len,fag);
            }
            else if (Data.masktype == cc.Mask.Type.RECT) {
                var retWord = cc.rect(pos.x-w/2,pos.y-h/2,w,h);
                if (retWord.contains(point)) {
                    fag = true;
                }
            }
        }

        if (fag) {
            this.node._touchListener.setSwallowTouches(false);
           // cc.log("==========1=========")
        } else {
            this.node._touchListener.setSwallowTouches(true);
            
        }
    },
   onTouchEnd(event){
        let point = event.getLocation();
        let pos = this.guideTouchNode.position;
        var  fag = false;
        if ( this.curIndx <=10) {
            var Data = this.stepList[this.curIndx];
            var w = Data.gSize.x;
            var h = Data.gSize.y;
            if (Data.masktype == cc.Mask.Type.ELLIPSE ) {
                var r = w/2;
                var x1 = (point.x-pos.x);
                var y1= (point.y-pos.y);
                var len = Math.sqrt(x1*x1+y1*y1);
            //  cc.log("========r",r,len);
                if (len< r) {
                    fag = true;
                }
                //cc.log("========r",r,len,fag);
            }
            else if (Data.masktype == cc.Mask.Type.RECT) {
                var retWord = cc.rect(pos.x-w/2,pos.y-h/2,w,h);
                if (retWord.contains(point)) {
                    fag = true;
                }
            }
        }

       
        // if (fag) {
        //     cc.log("=========onTouchEnd=========")
        //     var delayAct = cc.delayTime(0.001);
        //     var self = this;
        //     this.onHidePgae();
        //     var seq = cc.sequence(delayAct,cc.callFunc(function(){
        //         self.curIndx = self.curIndx +1;
        //         self.onRefreshShow();
        //        })
        //      );
        //      this.node.runAction(seq)
            
        // }
    
    },

    onHidePgae(){
        this.guideTouchNode.active = false;
        this.guidePoint.active = false;
        this.guide_descNode.active = false;
        this.guidePoint2.active = false;
        this.guidePoint3.active = false;
        for (let index = 1; index < 11; index++) {
            var richNode = cc.UITools.findNode(this.guide_descNode,"descRichText"+index);
            if (richNode) {
                richNode.active = false;
            } 
        }
     
    },

    onShowPage(){
        this.guideTouchNode.active = true;
        this.guidePoint.active = true;
        this.guide_descNode.active = false;
        this.guidePoint2.active = false;
        this.guidePoint3.active = false;
    },

 
    update (dt) {
        if (cc.UserInfo.guideClick == true) {
            cc.UserInfo.guideClick = false;
            var delayAct = cc.delayTime(0.001);
            var self = this;
            this.onHidePgae();
            var seq = cc.sequence(delayAct,cc.callFunc(function(){
                self.curIndx = self.curIndx +1;
                self.onRefreshShow();
               })
             );
             this.node.runAction(seq)
        }

    },
});
