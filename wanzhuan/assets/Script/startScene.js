// import { et } from "./Tools";
// import { Config } from "./Config";

let HotUpdate = require('./hotupdate/HotUpdate')

 function requireSomePack() {
        require('./Tools');
        require('./Config');

        require("./Common/UserInfo");//用户信息的
        require("./Common/staticData.js");//静态数据
        require("./Common/ConstDef");
        require("./Common/CommFunction");
        require ("./Utils/Util");
        require("./Utils/UITools");
        require ("./Engine/GameEngine");

        //公用的定义
        //枚举定义
        require("./Common/GlobalDef");
        //游戏事件定义
        require("./Common/EventNamDef");
        //https请求的
        require("./Common/Https");

        //各种管理器
        //资源管理器
        require("./Manager/ResMgr");
        //UI管理器
        require("./Manager/PanelMgr");
        //音频管理
        require("./Manager/AudioMgr");
        //场景管理
        require("./Manager/SceneMgr");
        //场景实体管理
        //require("./Manager/SceneEntityMgr");

        //定时器管理
        require("./Manager/TimerMgr");
        require("./Manager/ConfigMgr");
        require("./Manager/AtlasMgr");
      
    }

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        rootpanel: {
            default: null,
            type: cc.Node
        },
         
        hotNode:cc.Node,
        tiplayer:cc.Node,
        progressNode:cc.Node,
        count:0,
        countFlag:true,
        startSceneLoadingLayoutNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        requireSomePack()
        cc.debug.setDisplayStats(false);
        cc.startScene = this;
        cc.rootpanel = this.rootpanel;
        cc.mytiplayer = this.tiplayer;
        cc.startSceneLoadingLayoutNode = this.startSceneLoadingLayoutNode;
       
        // [1] ResolutionExactFit       Fill screen by stretch-to-fit: if the design resolution ratio of width to height is different from the screen resolution ratio, your game view will be stretched.<br/>
		// [2] ResolutionNoBorder       Full screen without black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two areas of your game view will be cut.<br/>
		// [3] ResolutionShowAll        Full screen with black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two black borders will be shown.<br/>
		// [4] ResolutionFixedHeight    Scale the content's height to screen's height and proportionally scale its width<br/>
		// [5] ResolutionFixedWidth     Scale the content's width to screen's width and proportionally scale its height<br/>
		// [cc.ResolutionPolicy]        [Web only feature] Custom resolution policy, constructed by cc.ResolutionPolicy<br/>
        this.progressNode.active =false
        this.tryTimes= 0

        this.hotUpdate=this.hotNode.getComponent(HotUpdate);
        this.http=require('Http');
        cc.log("====================  cc.sys.os=",cc.sys.os);
        if (cc.sys.isBrowser) {
            
            this.onUpdateFinished();
        }
        else if(cc.sys.os === cc.sys.OS_WINDOWS){
           
           
            this.requestReview();
            
            
        }
        else {
            cc.log("==============sasassas-----------")
            this.requestReview();
        }


    

         
     },

    start () {
       
     
    },
    onUpdateFinished() {
       
        this.countFlag = false;
        cc.log(" ==============onUpdateFinished============== ")
        if (cc.sys.os != cc.sys.OS_IOS && cc.sys.os != cc.sys.OS_ANDROID)
        {
            this.countFlag = true;
        }
        cc.Config.version=this.hotUpdate.version.string
           //开屏广告
           var self = this;
           var delayCallBack = function()
           {
               if (cc.sys.os == cc.sys.OS_ANDROID) {
                   jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'startSplash', '()V')
               }
               else if (cc.sys.os == cc.sys.OS_IOS) {
               
               }
               else{
                    if (cc.startScene != null ) {
                     
                        cc.startScene.onBeginGoIn();
                        cc.startScene = null;
                    }
               }
           }
        
           cc.PerDelayDo(cc.rootpanel,delayCallBack,0.5,null);
    },



    getNumVersion(str){
        var arr = str.split(".");
        var n = Number.parseInt(arr[0])*100 +  Number.parseInt(arr[1])*10 +  Number.parseInt(arr[2])*1;
       return n;
    },
    onBeginGoIn(){
      
        this.hotNode.x = 10000
        var ver_url = "http://dragon.wanlege.com/user/version";
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
                cc.log("登录请求返回get version",ret);
                if (ret.status == "ok") {//成功
                    cc.UserInfo.onlineVersion =  ret.data.version
                    cc.UserInfo.versiondata = ret;
                   
                    var nowVersion = self.getNumVersion(cc.UserInfo.nowVersion) //Number.parseFloat(cc.UserInfo.nowVersion);
                    var lineversion =  self.getNumVersion(ret.data.version) //Number.parseFloat(ret.data.version);
                    cc.log(nowVersion,lineversion,lineversion <= nowVersion)
                    if(lineversion <= nowVersion) {
                        self.onlaodCfig();
                    }
                    else{
                        var loadPrefabsCallBack = function(perfab)
                        {
                            var script = perfab.getComponent('noticepage');
                            script.onShowPage(ret);
                        }
                                
                        cc.myShowView(cc.PanelID.NOTIC_PAGE,20,null,loadPrefabsCallBack);  
                    }
                   
                }else{
                    self.onlaodCfig();
                }
            }
        };

        //请求登陆信息的
        var psObjdata = {
           
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        HttpHelper.httpPost(ver_url,psdata,onPostCallBack,this);
    },



    onlaodCfig()
    {
        var self = this;
        cc.configMgr.loadAllConfig(function() {
            cc.atlasMgr.loadAllPre(function() {
    
            });
            cc.UserInfo.token = cc.myGetTakenLocal();//获取token
     
            self.turnToWxPage();

        });
        
    },

    turnToWxPage(){
        var loadPrefabsCallBack = function(perfab)
        {
           var script = perfab.getComponent('wxlogin');
           if (cc.UserInfo.token == "" || cc.UserInfo.token == null ) {//等于空的
               
           }
           else{

               script.showOnLoadingBaseInfo();//获取基本信息
           }
        }
      
        cc.myShowView(cc.PanelID.WX_LOGINPAGE,-1,null,loadPrefabsCallBack);//进来默认是显示微信登陆

    },



    showOnLoadingBaseInfo:function() {
      
        this.getBaseInfo();
    },
    getBaseInfo(){
        var pself = this;
        var onPostCallBack  = function(self,ret){
            if (ret != -1) {
               
                if (ret.status == "ok") {//成功
                  
                    pself.onLoadPrefab();
                }else{
                    cc.myHideView(cc.PanelID.LOADING_PAGE);
                    cc.myShowView(cc.PanelID.WX_LOGINPAGE,-1);//进来默认是显示微信登陆
                    
                }
            }
        }
        HttpHelper.httpPostGetBaseInfo(onPostCallBack);
    },

    onLoadPrefab()
    {
        var callback = function()
        {
          
            cc.myHideView(cc.PanelID.PW_LOGIN);
            cc.myHideView(cc.PanelID.WX_LOGINPAGE);
            cc.myShowView(cc.PanelID.MAIN_PAGE,0);
            
        }
        
        cc.onLoadAllPrefab(callback);

    },
  
 
    update (dt) {
        this.count  =  this.count + dt;
        if (this.count >1.0 && this.countFlag == false) {
            this.countFlag = true;
            this.onBeginGoIn();
        }

     },


     requestReview() {
        console.log('loading 1');
        var self = this;
        this.tryTimes++;
        cc.log("================================", cc.Config.game);
        var fn = function (ret) {
            console.log('========== reviewing :' + ret.version);
            console.log('========== release :' + ret.release);
            console.log('========== version :' + cc.et.getVersion());

         
            if (cc.sys.os == cc.sys.OS_IOS) {
                cc.et.reviewingVersion = ret.version;
                if (ret.version == cc.et.getVersion()) {
                    console.log('正在审核，直接进入');
                    cc.et.reviewing = true;
                    self.onUpdateFinished();
                }
                else if (ret.release.ios != cc.et.getVersion()) {
                    cc.et.reviewing = true;
                    self.onUpdateFinished();
                } else {
                    if (ret.servercnf) {
                         cc.Config.servercnf = ret.servercnf;
                        cc.log("save servercnf");
                    }
                    self.hotUpdate.checkUpdate(self);
                }
            } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                if (ret.release.android != cc.et.getVersion()) {
                    console.log('有新版本奥');
                    cc.et.reviewing = true;
                    self.onUpdateFinished();
                } else {
                    if (ret.servercnf) {
                         cc.Config.servercnf = ret.servercnf;
                        cc.log("save servercnf");
                    }
                    console.log('loading 2');
                    self.hotUpdate.checkUpdate(self);
                }
            } else {
                if (ret.servercnf) {
                     cc.Config.servercnf = ret.servercnf;
                    cc.log("save servercnf");
                }
                console.log('loading 2');
                self.hotUpdate.checkUpdate(self);
            }
        };
        this.http.sendRequest( cc.Config.game + "/review.json", {}, fn,  cc.Config.update, this.onerror.bind(this), this.ontimeout.bind(this))
    },

    ontimeout() {
        var self = this;
        // if (this.tryTimes < 3) {
        //     self.requestReview();
        //     return;
        // };
   
    },

    onerror(arg) {
        cc.log('http onerror: ' + JSON.stringify(arg));
       // this.ontimeout();
    },


});
