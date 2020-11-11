/**
 * Http 请求封装
 */
const HttpHelper = cc.Class({
    extends: cc.Component,

    statics: {
    },

    properties: {
      
    },

    /**
     * get请求
     * @param {string} url 
     * @param {function} callback 
     */
    httpGet(url, callback,self) {
      
        // let xhr = cc.loader.getXMLHttpRequest();
        // xhr.onreadystatechange = function () {
          
        //     if (xhr.readyState === 4 && xhr.status == 200) {
        //         let respone = xhr.responseText;
        //         let rsp = JSON.parse(respone);
        //         callback(rsp,self);
        //     } else if (xhr.readyState === 4 && xhr.status == 401) {
            
        //         callback({status:401},self);
        //     } else {
        //         callback(-1,self);
        //     }
        // };
        // xhr.withCredentials = true;
        // xhr.open('GET', url, true);
        // xhr.timeout = 8000;// 8 seconds for timeout
        // xhr.send();


        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            //cc.log("=========================xhr =",xhr)
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let respone = xhr.responseText;
                        let rsp = JSON.parse(respone);
                        callback(rsp,self);
                } else {
                    callback({status:401},self);
                }
            }
        }.bind(this);

        //responseType一定要在外面设置
        xhr.responseType = 'arraybuffer';
        xhr.open("GET", url, true);
        xhr.send();
    },

    /**
     * post请求
     * @param {string} url 
     * @param {object} params 
     * @param {function} callback 
     */
    httpPost(url, params, callback,self) {
       // cc.myGame.gameUi.onShowLockScreen();
        let xhr = cc.loader.getXMLHttpRequest();
        var sthis = this;
        xhr.onreadystatechange = function () {
            // cc.log('xhr.readyState=' + xhr.readyState + '  xhr.status=' + xhr.status);
            if (xhr.readyState === 4 && xhr.status == 200) {
                let respone = xhr.responseText;
                let rsp = JSON.parse(respone);
               // cc.log("请求返回的数据:",rsp);
                callback(self,rsp);
                if (rsp.status == "no") {
                    cc.log("rsp.status == no 请求返回的数据:",rsp);
                    sthis.onPopNoticePage(rsp);
                }
            } else {
               // cc.log("请求返回的错误-1");
                callback(self,-1);
            }
        };
        xhr.open('POST', url, true);
        // if (cc.sys.isNative) {
       // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
       // xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST');
       // xhr.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type');
        // xhr.setRequestHeader("Content-Type", "application/json");
        // xhr.setRequestHeader('Authorization', 'liangivan');
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
        if (cc.UserInfo.token != "") {
           
            // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            // xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST');
            // xhr.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type');
            xhr.setRequestHeader('Authorization', cc.UserInfo.token);
        }
        
        // }
        xhr.timeout = 8000;// 8 seconds for timeout
       // var jsonStr = JSON.stringify(params);
       var jsonStr = params;
        // cc.log("   请求的数据:",jsonStr);
        xhr.send(jsonStr);
    },
    
    httpPostMessage(url, params, callback,self) {
         let xhr = cc.loader.getXMLHttpRequest();
         xhr.onreadystatechange = function () {
             if (xhr.readyState === 4 && xhr.status == 200) {
                 let respone = xhr.responseText;
                 let rsp = JSON.parse(respone);
                 callback(self,rsp);
             } else {
                 callback(self,-1);
             }
         };
         xhr.open('POST', url, true);
         xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
         xhr.timeout = 8000;// 8 seconds for timeout
        var jsonStr = params;
         xhr.send(jsonStr);
     },

    /**
     * 登录专用

     */
    httpPostGetBaseInfo(callback) {
       
        var onPostCallBack  = function(self,ret){
            
            if (ret != -1) {
                
                cc.log("======httpPostGetBaseInfo==========",ret)
                if (ret.status == "ok") //成功
                {
                  var data = ret.data;
                 
                  cc.UserInfo.adv_gold = data.adv_gold;
                  cc.UserInfo.adv_times = data.adv_times;
                  cc.UserInfo.box_status = data.box_status;
                  cc.UserInfo.explore_gold = data.explore_gold;
                  cc.UserInfo.explore_itemid = data.explore_itemid;
                  cc.UserInfo.explore_times = data.explore_times;
                  cc.UserInfo.guess = data.guess;
                  cc.UserInfo.guessf = data.guessf;
                  cc.UserInfo.unionid = data.unionid;
                  cc.UserInfo.up_num = data.up_num;
                  cc.UserInfo.video_jiasu = data.video_jiasu;
                  cc.UserInfo.id = data.id;//用户id
                  cc.UserInfo.parent_id = data.parent_id;
                  cc.UserInfo.invite_id = data.invite_id
                  cc.UserInfo.mobile = data.mobile,//手机号
                  cc.UserInfo.level = data.level;//等级
                  cc.UserInfo.nickname = data.nickname;//昵称
                  cc.UserInfo.rmb =  Number(data.rmb);//人民币
                  cc.UserInfo.gold =  Number(data.gold);//金币
                  cc.UserInfo.diamond =  Number(data.diamond);//钻石
                  cc.UserInfo.head = data.head;//头像
                  cc.UserInfo.status = Number(data.status);//0表示正常
                  cc.UserInfo.ident = data.ident;
                  cc.UserInfo.rmb_jiasu = Number(data.rmb_jiasu);//加速次数 
                  cc.UserInfo.video_jiasu = Number(data.video_jiasu);//视频加速次数
                  cc.UserInfo.box_status = Number(data.box_status);
                  cc.UserInfo.cash_min = Number(data.cash_min);//是否可提最小0.5金额（0可提，1不可提)
                  cc.UserInfo.steal_times = Number(data.steal_times);//当天已偷次数
                  cc.UserInfo.hb_list= data.hb_list;//红包列表 
                  cc.UserInfo.serverTime = Number(data.server_time);
                  cc.UserInfo.sever_local_x = cc.getLocalTimeServer(cc.UserInfo.serverTime);
                  cc.UserInfo.up_num = data.up_num;
                  cc.UserInfo.items_list = data.item_list;//物品列表的
                  cc.UserInfo.vip =  Number(data.vip);
                  cc.UserInfo.follow_mp = Number(data.follow_mp);
                  cc.UserInfo.ident_gift = Number(data.ident_gift);
                  cc.UserInfo.signin = data.signin;
                  cc.UserInfo.signin_time= data.signin_time;
                  cc.UserInfo.level_reward = data.level_reward;
                  cc.UserInfo.guideStep = data.step;//新手引导的

                  cc.UserInfo.new_user = data.new_user;//是否是新用户
                  cc.UserInfo.invite_num = data.invite_num;//邀请次数
                  cc.UserInfo.ident_xx = data.ident_xx;
                  cc.UserInfo.invite_rmb = data.invite_rmb;//
                  cc.UserInfo.permanent = data.permanent;//
                  cc.UserInfo.progress1 = Number.parseFloat(data.progress1).toFixed(2);
                  cc.UserInfo.progress2 =  Number.parseFloat(data.progress2).toFixed(2);
                  cc.UserInfo.progress3 =  Number.parseFloat(data.progress3).toFixed(2);

                  cc.UserInfo.friend_rmb  =  Number.parseFloat(data.friend_rmb).toFixed(2)  ;// 好友累计总收益
                  cc.UserInfo.jieduan = Number.parseInt(data.jieduan)   ;//阶第一段
                  cc.UserInfo.friend_rmb_level1 =  Number.parseFloat(data.friend_rmb_level1).toFixed(2)  ;//徒弟贡献
                  cc.UserInfo.friend_rmb_level2 =  Number.parseFloat(data.friend_rmb_level2).toFixed(2)  ;//徒孙

                  cc.UserInfo.market = Number.parseInt(data.market);//市场
                  cc.UserInfo.today_video_num  = Number.parseInt(data.today_video_num);//  当天下线视频数量

                  //cc.log("===========cc.UserInfo.sever_local_x=",cc.UserInfo.sever_local_x);
                //   cc.log(cc.UserInfo.hb_list);
                    if (callback) {
                    callback(self,ret);
                    }
                }
                else{
                    self.onPopNoticePage(ret);
                    cc.myHideView(cc.PanelID.LOADING_PAGE)
                }
            }
        };
        var psObjdata = {
          
        };
        var psdata = cc.JsonToPostStr(psObjdata);
        this.httpPost(cc.UrlTable.url_user_info,"",onPostCallBack,this);

    },

    onPopNoticePage(ret)
    {
        cc.log("======msg = no ==========",ret)
        var data = ret.data;
        var fag = false;
        if (data.other_login != null && data.other_login == 1) {
            fag = true;
        }
        if (data.needLogin != null && data.needLogin == 1) {
            fag = true;
        }

        if (data.out_service != null && data.out_service == 1) {
            fag = true;
        }
        var loadPrefabsCallBack = function(perfab)
        {
            var script = perfab.getComponent('noticepage');
            script.onShowPage(ret);
        }
        if (fag == true) {
            if ( cc.UserInfo.isShowNoticeFag == true) {
                return;
            }
            cc.UserInfo.isShowNoticeFag = true;
           // cc.log("======fagfagfagfagfag  ==========",fag,cc.allViewMap[cc.PanelID.NOTIC_PAGE] );
            cc.myShowView(cc.PanelID.NOTIC_PAGE,20,null,loadPrefabsCallBack);  
        }
    },


//微信登陆的接口的
    onLoginResp(token) {
        cc.log('===================== token = ',token);
        console.log('onLoginResp ' + token);
        if (token == '-2') {
            //用户取消
            cc.log('user cancel');
            return;
        }
        else if (token == '-4') {
            //用户拒绝
            cc.log('user deny');
            return;
        }
        else if (token == '-6') {
              //签名错误
            cc.log('sign error');
            return;
        }
        else { //拉取信息成功
            cc.log('wx_token:' + token);
            var perfab = cc.allViewMap[cc.PanelID.WX_LOGINPAGE];
            
            if (perfab != null  ) {
                var script = perfab.getComponent('wxlogin');
                script.onPostLogin(token);
            }
            
        }
    },
    
    onLogShare(p){
        cc.log('============1========= share = ',p);
    },
    onLogShare2(p){
        cc.log('==========2=========== share = ',p);
    },
    onMyLog(s)
    {
        cc.log(s);
    },
    
    onMyCallForJava(arg)
    {
        cc.log('==========onMyCallForJava=========== ',arg);
        if (arg == "onReward") {
           
            if (cc.getRewardVideo) {
                cc.getRewardVideo() ;
            }else{
                if (cc.UserInfo.showVideoPage) {
                    cc.UserInfo.showVideoPage.onFinishGetReward();
                    cc.UserInfo.showVideoPage = null;
                    cc.UserInfo.limitTimeViedoFlag =  true;
                    cc.UserInfo.limitTime = 15;
                  }
            }
        }
        else if (arg == "videoclose") {
            if (cc.getRewardVideo) {
                cc.getRewardVideo() ;
            }else{
                if (cc.UserInfo.showVideoPage) {
                    cc.UserInfo.showVideoPage.onFinishGetReward();
                    cc.UserInfo.showVideoPage = null;
                    cc.UserInfo.limitTimeViedoFlag =  true;
                    cc.UserInfo.limitTime = 15;
                  }
            }
        }
        else if (arg ==  "splash") {
            if (cc.startScene != null ) {
                cc.startScene.onBeginGoIn();
                cc.startScene = null;
            }
        }
        
    },


    loadImage: function (url1, callback) {
       // cc.log("======111=========url, callback =",url1, callback)

        cc.loader.load({url:url1,type:'png'},function(err,tex){
            let spriteFrame = new cc.SpriteFrame(tex);
            callback(spriteFrame);
          });
    },

    // 下载远程图片
    downloadRemoteImageAndSave: function (url, callback,newfilename) {
        cc.log("================downloadRemoteImageAndSave=========1",CC_JSB,url)
        if (url == null || url == "") {
            return;
        }
       
        if (CC_JSB == false) {
            let self = this;
            cc.loader.load({url:url,type:'png'},function(err,tex){
                callback(tex);
              });
              return
        } else {
            let dirpath = jsb.fileUtils.getWritablePath() + '';
            let formatedFilename = this.convertPathRemoveDirectory(url);
           // cc.log("=========================formatedFilename =",formatedFilename)
            if (formatedFilename == null || formatedFilename == "") {
                callback(null);
                return;
            }
            let filepath = dirpath + formatedFilename;
            if (!this.isValidCommonSuffix(this.getSuffixFromPath(filepath))) {
                // 防止有的网址不带图片后缀
                filepath += '.png';
            }
            //cc.log("=========================filepath =",filepath)
            let self = this;
            if (jsb.fileUtils.isFileExist(filepath)) {
                // 图片存在，直接加载
               // cc.log("===========2==============filepath =",filepath)
                self.loadImage(filepath, callback);
                return;
            }

            var saveFile = function (data) {
                if (data) {
                    // if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
                    //     // 目录不存在，创建
                    //     jsb.fileUtils.createDirectory(dirpath);
                    // }
                   // cc.log("=========================data =",data)
                    var newPath = dirpath+newfilename;
                    if (jsb.fileUtils.writeDataToFile(new Uint8Array(data), newPath)) {
                        // 成功将下载下来的图片写入本地
                        //cc.log("=========================newPath =",newPath)
                        self.loadImage(url, callback);
                    } else {
                        callback(null);
                    }
                } else {
                    callback(null);
                }
            };
        }

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            //cc.log("=========================xhr =",xhr)
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    saveFile(xhr.response);
                } else {
                    saveFile(null);
                }
            }
        }.bind(this);

        //responseType一定要在外面设置
        xhr.responseType = 'arraybuffer';
        xhr.open("GET", url, true);
        xhr.send();
    },

    // 将网址中的"/"转换成"__"
    convertPathRemoveDirectory: function (path) {
        if (path == null) {
            return "";
        }

        let len = path.length;
        path = path.substr(8, len);
        path = path.replace(/\//g, '__');
        return path;
    },

    getSuffixFromPath: function (path) {
        let index = path.lastIndexOf('.');
        if (index < 0) {
            return "";
        }

        return path.substr(index);
    },

    isValidCommonSuffix: function (s) {
        if (typeof s !== "string" || s == "" || s == "unknown") {
            return false;
        }

        if (s.length > 4) {
            return false;
        }

        let index = s.indexOf('.');
        if (index == -1) {
            return false;
        }

        return true;
    },




});

window.HttpHelper = new HttpHelper();
