//获取本地taken的
cc.myGetTakenLocal = function()
{
    var tk = cc.sys.localStorage.getItem('myuserivan');
    return tk
}
//保存对应的Taken到本地
cc.mySetTakenLocal = function(tokenStr)
{
    cc.sys.localStorage.setItem('myuserivan', tokenStr);
}

cc.showErrorCode = function(protoName, prototab) {
    if(prototab.error_code == 0) {
        return;
    }

    var protoErrCode = error_code[protoName];
    if(protoErrCode != null) {
        cc.log(protoErrCode);
        var tip = protoErrCode[prototab.error_code];
        if (tip && tip.indexOf('<color') !== -1)
            cc.panelMgr.showView(cc.PanelID.COMMON_POPUP_PANEL, null, tip);
        else
            cc.showFlyMsg(tip);
    }
}
//把对象数组转换成post的数据
cc.JsonToPostStr = function(objdata)
{
    var str = "";
    for( var key in objdata ){
        var val = objdata[key]
        if (str !== "") {
            str = str + "&" + key + "=" + val;
        } else {
            str =  key + "=" + val;
        }   
    };

    return str
}

cc.countPreLoadprefab = 0;

cc.onLoadAllPrefab = function(callback)
{
    var count = 0;
    var haveLoadCount = 0;
    
    // var pCallBack = function()
    // {
    //     haveLoadCount = haveLoadCount +1;
    //    // cc.log("========xxxxxx===========",count,haveLoadCount)
    //     if (haveLoadCount >= count) {
    //         if (callback) {
    //             callback();
    //         }
    //     }
    //     else{
    //         cc.myShowView(cc.PanelID.LOADING_PAGE,15);  
    //     }
    // }

    // for (const key in cc.preLoadScriptList) {
    //     if (cc.preLoadScriptList.hasOwnProperty(key)) {
    //         count = count + 1;
    //          //cc.log("==============",count,key);
    //         cc.myPreloadPrefab(key,5,pCallBack);
            
    //     }
    // }

    var keyList= []
    for (const key in cc.preLoadScriptList) {
        if (cc.preLoadScriptList.hasOwnProperty(key)) {
            count = count + 1;
           keyList.push(key);
        }
    }
    //cc.log("==========keyList=",keyList,"===========count=",count)

    var index =0;
    var preloadCallBack2 =null;


    var delayCallBack = function()
    {
        cc.myPreloadPrefab(keyList[index],5,preloadCallBack2);
        
    }
    var preloadCallBack = function()
    {
         index =index + 1;
         if (index>=count ) {
            if (callback) {
                callback();
            }
         }
         else{
            cc.myShowView(cc.PanelID.LOADING_PAGE,15);  
            cc.PerDelayDo(cc.rootpanel,delayCallBack,0.1,null);
         }
       
    }
    preloadCallBack2 = preloadCallBack;
    cc.myPreloadPrefab(keyList[index],5,preloadCallBack2);
   


}


cc.myPreloadPrefab = function(pid,zord,pCall)
{
    var preCallabck = function(prefabNode)
    {
        cc.countPreLoadprefab = cc.countPreLoadprefab + 1;
        //cc.log(pid,cc.countPreLoadprefab, cc.preLoadScriptList.length);
        if (cc.countPreLoadprefab >= 20) {
            // cc.myHideView(cc.PanelID.LOADING_PAGE)
           
        }else{
            cc.myShowView(cc.PanelID.LOADING_PAGE,11); 
        }
        if (pCall) {
            pCall();
        }
        //prefabNode.active = false;
        prefabNode.setPosition(-2000,0);
    }
    cc.myShowView(pid,zord,null,preCallabck)
   
}



//显示摸个预设的
cc.myShowPrefab = function(pid,parent,zord,callback){
    var PrefabUrl = cc.PanelID2ResPath[pid];
    //加载预制资源
    cc.loader.loadRes(PrefabUrl, function(errorMessage,loadedResource){
        //检查资源加载
        if( errorMessage ) { cc.log( 'errorMessage:' , errorMessage,pid ); return; }
        if( !( loadedResource instanceof cc.Prefab ) ) { cc.log( '你载入的不是预制资源!' ); return; } 
        //开始实例化预制资源
        var myPrefabNode = cc.instantiate(loadedResource);
        //将预制资源添加到父节点
        parent.addChild(myPrefabNode,zord);
       cc.allViewMap[pid] = myPrefabNode;
       if (callback) {
         callback(myPrefabNode)
       }
   });
}

cc.onDestoryView = function (pid){
    //cc.log("===pppp====cc.onDestoryView ================",cc.allViewMap[pid],cc.preLoadScriptList[pid])
    if(cc.allViewMap[pid] != null) {
        if (cc.preLoadScriptList[pid] != null) {
          //  cc.log("==pppp====cc.preLoadScriptList[pid] ================",cc.preLoadScriptList[pid])
            var script = cc.allViewMap[pid].getComponent(cc.preLoadScriptList[pid]);
            script.node.x = -2000;
         
            return;
        }
    }
    
    var view = cc.allViewMap[pid];
    if (view != null) {
      //  cc.log("===pppp====view.destroy========xxx",pid);
        view.destroy();
        cc.allViewMap[pid] = null;
    }
}
//默认是加载在根节点上面
cc.myShowView = function(pid,zord,parent,callback)
{   
    var p = cc.rootpanel;
    var z = 1;
    if (parent != null) {
        p = parent;
    }
    if (zord != null) {
        z = zord;   
    }

    if(cc.allViewMap[pid] != null) {
        var prefabNode = cc.allViewMap[pid];
      
        if (cc.preLoadScriptList[pid] != null) {
            var script = prefabNode.getComponent(cc.preLoadScriptList[pid]);
            script.start();
            script.node.x = 0;
            script.node.zIndex = z;
        }else{
            cc.allViewMap[pid].active = true;
           
        }
        if (callback) {
            callback(prefabNode)
        
        }
        return;
    }
   

    cc.myShowPrefab(pid,p,z,callback);
}

//隐藏一个节点
cc.myHideView = function(pid)
{   
   // cc.log(cc.allViewMap[pid]);
    if(cc.allViewMap[pid] == null) {
        return;
    }else{
    
        if (cc.preLoadScriptList[pid] != null) {
            var script = prefabNode.getComponent(cc.preLoadScriptList[pid]);
            script.node.x = -2000;
           
            return;
        }else{
            cc.allViewMap[pid].active = false
        }
    }
}
//此处是处理显示diaolog弹窗的

