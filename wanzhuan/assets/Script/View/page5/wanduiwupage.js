
cc.Class({
    extends: cc.Component,

    properties: {
        maskLayoutNode:cc.Node,
        topLayoutNode:cc.Node,
        topLayoutNode2:cc.Node,
        downLayoutNode:cc.Node,

        itemLayoutNode: { 
            default: null,
            type: cc.Node
        },
        itemLayoutNode2: { 
            default: null,
            type: cc.Node
        },
        item_prefab:{  //项的资源预制体
            type:cc.Prefab,
            default:null,
        },
        contentNode:{
            default: null,
            type: cc.Node
        },
        contentView:{
            default: null,
            type: cc.Node
        },
        scrollView:{
            default: null,
            type: cc.Node
        },
        contentNode2:{
            default: null,
            type: cc.Node
        },
        contentView2:{
            default: null,
            type: cc.Node
        },
        scrollView2:{
            default: null,
            type: cc.Node
        },
        allItemList:[],
        allItemList2:[],
        levelNumNode1:cc.Node,
        levelNumNode2:cc.Node,
        levelBtnNode1:cc.Node,
        levelBtnNode2:cc.Node,
        curPage1:0,
        pageCount1:1,
        curPage2:0,
        pageCount2:1,
        curLevFriend:1,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        if (cc.getIsIphoneX() == true) {
            var maskButtonNode = cc.UITools.findNode(this.node,"maskButton");
            if (maskButtonNode != null) {
                maskButtonNode.scale = 1.25;
            }
            this.topLayoutNode.y = this.topLayoutNode.y +cc.iphone_off_Y*2.0;
            this.topLayoutNode2.y = this.topLayoutNode2.y +cc.iphone_off_Y*2.0;
            this.downLayoutNode.y = this.downLayoutNode.y +cc.iphone_off_Y*1.0;
           // this.downLayoutNode.setContentSize(this.downLayoutNode.getContentSize().width,this.downLayoutNode.getContentSize().height + cc.iphone_off_Y*4);
            this.scrollView.setContentSize(this.scrollView.getContentSize().width,this.scrollView.getContentSize().height + cc.iphone_off_Y*2.5);
            this.contentView.setContentSize(this.contentView.getContentSize().width,this.contentView.getContentSize().height + cc.iphone_off_Y*2.5);
            this.contentNode.setContentSize(this.contentNode.getContentSize().width,this.contentNode.getContentSize().height + cc.iphone_off_Y*2.5);
            // this.downLayoutNode.setContentSize(this.downLayoutNode.getContentSize().width,this.downLayoutNode.getContentSize().height + cc.iphone_off_Y*4);
            this.scrollView2.setContentSize(this.scrollView2.getContentSize().width,this.scrollView2.getContentSize().height + cc.iphone_off_Y*2.5);
            this.contentView2.setContentSize(this.contentView2.getContentSize().width,this.contentView2.getContentSize().height + cc.iphone_off_Y*2.5);
            this.contentNode2.setContentSize(this.contentNode2.getContentSize().width,this.contentNode2.getContentSize().height + cc.iphone_off_Y*2.5);
        
            this.maskLayoutNode.setContentSize(this.maskLayoutNode.getContentSize().width,this.maskLayoutNode.getContentSize().height + cc.iphone_off_Y*6);
        }
     },

    start () {
       
    
        var levelNum1 = this.levelNumNode1.getComponent(cc.Label);
        var levelNum2 = this.levelNumNode2.getComponent(cc.Label);
        levelNum1.string = cc.UserInfo.syData.level1_num;
        levelNum2.string = cc.UserInfo.syData.level2_num;

        this.onPostGetLog(1)
    },

    onClickLevelBtn(event, customEventData)
    {
        var levelBtn1 = this.levelBtnNode1.getComponent("cc.Button") ;   
        var levelBtn2 = this.levelBtnNode2.getComponent("cc.Button") ;   
        levelBtn1.interactable = true;
        levelBtn2.interactable = true;
        if (customEventData ==  1) {
            levelBtn1.interactable = false;
            this.scrollView.active = true;
            this.scrollView2.active = false;
            this.curLevFriend = 1;
        }else if (customEventData ==  2) {
            levelBtn2.interactable = false;
            this.scrollView2.active = true;
            this.scrollView.active = false;
            this.curLevFriend = 2;
        }
        
        if (customEventData == 1) {
            if (this.curPage1==0) {
                this.onPostGetLog(1);
            }
        }
        else if (customEventData == 2) {
            cc.log("===this.curPage2 =",this.curPage2 )
            if (this.curPage2 == 0 ) {
                this.onPostGetLog(2);
            }

        }
    },

    onPostGetLog(ty)
    {
       

        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
              
                if (ret.status == "ok") {//
                    cc.log("===============",self.curLevFriend ,self.curPage1)
                    cc.log("url_wan dui wu_log====",ret);

                    var data = ret.data;
                   
                    if (self.curLevFriend == 1) {
                        self.curPage1 =  self.curPage1 +1;
                        self.pageCount1 = data.page_count;
                    }else{
                        self.curPage2 =  self.curPage2 +1;
                        
                        self.pageCount2 = data.page_count;
                    }
                   
                    self.onShowLogLayout(data.list);
                }
                else{
                  
                }
                cc.myHideView(cc.PanelID.LOADING_PAGE)
            }
        };

        var tmpPage = this.curPage1;
        if (ty == 2) {
            tmpPage = this.curPage2;
        }
        var psObjdata = {
           type:ty,
           page:tmpPage+1,
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        cc.log("================ 请求玩赚队伍 信息：",psdata)
        HttpHelper.httpPost(cc.UrlTable.url_person_invite_list,psdata,onPostCallBack,this);
        cc.myShowView(cc.PanelID.LOADING_PAGE,15);
    },

    scrollcallback(scrollview, eventType, customEventData) {
        
        if (eventType == cc.ScrollView.EventType.BOUNCE_BOTTOM) {
            if (customEventData == 1) {
                if (this.curPage1< this.pageCount1 ) {
                    this.onPostGetLog(1);
                }else{
                    cc.showCommTip("已到尾页");
                }
            }
            else if (customEventData == 2) {
                if (this.curPage2< this.pageCount2 ) {
                    this.onPostGetLog(2);
                }else{
                    cc.showCommTip("已到尾页");
                }
            }
           
           
        }
        //console.log(eventType);
    },
    onShowLogLayout(list)
    {
        
        for (const key in list) {
            if (list.hasOwnProperty(key)) {
                const element = list[key];
              
                var item = cc.instantiate(this.item_prefab);
                
                
                var script = item.getComponent('wanduiwuitem');
                script.onSetData(element);
                if ( this.curLevFriend == 1) {
                    this.itemLayoutNode.addChild(item);
                    this.allItemList.push(item);
                }
                else{
                    this.itemLayoutNode2.addChild(item);
                    this.allItemList2.push(item);
                }
                
            }
        }
     
        this.contentNode.height = this.allItemList.length *83;
        if ( this.contentNode.height < (960+cc.iphone_off_Y *4)) {
            this.contentNode.height = (960 +cc.iphone_off_Y *4);
        }

        this.contentNode2.height = this.allItemList2.length *83;
        if ( this.contentNode2.height < (960+cc.iphone_off_Y *4)) {
            this.contentNode2.height = (960 +cc.iphone_off_Y *4);
        }

    },

    onClickExit()
    {

        cc.onDestoryView(cc.PanelID.PERSON_WANDUIWU); 
    }
   

    // update (dt) {},
});
