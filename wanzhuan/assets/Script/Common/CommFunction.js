
cc.myStrLength  =  function (str) {
    var a = 0;
      for (var i = 0; i < str.length; i++) {
          if (str.charCodeAt(i) > 255)
              a += 2;//按照预期计数增加2
          else
              a++;
      }
      return a;
}

// 判断是否为手机号
cc.isPoneAvailable = function (pone) {
    // var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    // if (!myreg.test(Number(pone))) {
    //   return false;
    // } else {
    //   return true;
    // }
    //服务器去校验
    return true;
  }
  // 判断是否为电话号码
  cc.isTelAvailable= function (tel) {
    var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    if (!myreg.test(tel)) {
      return false;
    } else {
      return true;
    }
  }


//校验是否全由数字组成
 cc.isDigit = function(s)
 {
    var patrn=/^[0-9]{1,20}$/;
    if (!patrn.exec(s)) return false
    return true
 }

 //校验密码：只能输入6-20个字母、数字、下划线  
  cc.isPasswd =   function(s)  
  {  
    var patrn=/^(\w){6,20}$/;  
    if (!patrn.exec(s)) return false
    return true
  }  

 //校验登录名：只能输入6-20个以字母开头、可带数字、“_”、“.”的字串
  cc.isRegisterUserName =  function (s)  
 {  
    var patrn=/^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){5,19}$/;  
    if (!patrn.exec(s)) return false
    return true
  }

  cc.UpDownAction = function (n)
  {
      var t = 0.6;
      var len = 4;
      var act1 = cc.moveBy(t,cc.v2(0,len));
      var act2 = cc.moveBy(t,cc.v2(0,-len));
      var act3 = cc.moveBy(t,cc.v2(0,-len));
      var act4 = cc.moveBy(t,cc.v2(0,len));
      var action = cc.sequence(act1,act2,act3,act4);
      var repeat = cc.repeatForever(action);
      n.runAction(repeat);

      // var delayAct = cc.delayTime(Math.random());
      // var seq = cc.sequence(delayAct,repeat);
      // n.runAction(seq)
  }
  cc.DelayActionUpDownAction = function (n)
  {
    var t = Math.random();
    //cc.log("============================ t=",t);
     var delayAct = cc.delayTime(Math.random());
     var seq = cc.sequence(delayAct,cc.callFunc(function(){
        cc.UpDownAction(n);
        })
      );
      n.runAction(seq)

  };
  
  //延迟时间动作干事情用的
  cc.PerDelayDo = function(node,callFunc,t,self)
  {

      var delayAct = cc.delayTime(t);
      var action = cc.sequence(delayAct,cc.callFunc(function(){
        if (callFunc) {
            callFunc(self);
        }
        },self)
      );
      node.runAction(action)
  },


  //显示提示的
  cc.conShowTipAction = function (labelNode,str,callFunc,self){
    var label =  labelNode.getComponent(cc.Label);
    if (label != null) {
      label.string = str;
    }
    var fadein = cc.fadeIn(0.01);
    var delayAct = cc.delayTime(2.0);
    var fadeAct = cc.fadeOut(1.0);
    var action = cc.sequence(fadein,delayAct,fadeAct,cc.callFunc(function(){
        if (callFunc) {
            callFunc(self);
        }
        },self)
    );

    labelNode.runAction(action)
}

//龙的获得金币的动画
cc.moneyShowAction = function(labelNode,str,callFunc,self)
{
  
    var label =  labelNode.getComponent(cc.Label);
    if (label != null) {
      label.string = str;
    }
    labelNode.y =  labelNode.y-100;
    // cc.log(labelNode,str,callFunc);
    var fadein = cc.fadeIn(0.01);
    var t = 0.75;
    var moveBy1 = cc.moveBy(t,cc.v2(0,50));
    var fadeOut = cc.fadeOut(t);
    var moveBy2 = cc.moveBy(t,cc.v2(0,50));
    var spa = cc.spawn(fadeOut,moveBy2)
    var action = cc.sequence(fadein,moveBy1,spa,cc.callFunc(function(){
        if (callFunc) {
            callFunc(self);
        }
        },self)
    );

  labelNode.runAction(action)

}

cc.getLocalTimeServer = function(servtime)
{
 
   var x =   servtime - Math.round(new Date() / 1000);
   //cc.log("========================",x,Math.round(new Date() / 1000),servtime);
   return x

}


//获取和当前的时间长
cc.getTimeLeft = function(youtime)
{
    var curtime = Math.round(new Date() / 1000) + cc.UserInfo.sever_local_x;
    var left = curtime - Number(youtime);
    return left
}
cc.getLeftShowFormat = function(youtime)
{
   var leftTime = cc.getTimeLeft(youtime);

   return cc.formatSeconds(leftTime)
}

cc.pad2 =function(num) {
 if (num <10) {
   return "0"+ num;
 }
 return num
}

cc.formatSeconds = function (value) {
  var secondTime = parseInt(value);// 秒
  var minuteTime = 0;// 分
  var hourTime = 0;// 小时
  if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60);
      //获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60);
      //如果分钟大于60，将分钟转换成小时
      if(minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
      }
  }

  var result = cc.pad2(hourTime) +  ":" + cc.pad2(minuteTime) +  ":" + cc.pad2(secondTime) ;

  // if(minuteTime > 0) {
  //     result = "" + parseInt(minuteTime) + ":" + result;
  // }
  // if(hourTime > 0) {
  //     result = "" + parseInt(hourTime) + ":" + result;
  // }
  return result;
}

//console.log(time.formatTime(sjc,'Y/M/D h:m:s'));//转换为日期：2017/03/03 03:03:03
//console.log(time.formatTime(sjc, 'h:m'));//转换为日期：03:03
 cc.formatTime = function(number,format) {  
  //数据转化  
    var formatNumber = function(n){
      n = n.toString()  
        return n[1] ? n : '0' + n  
    }

    var formateArr  = ['Y','M','D','h','m','s'];  
    var returnArr   = [];  

    var date = new Date(number * 1000);  
    returnArr.push(date.getFullYear());  
    returnArr.push(formatNumber(date.getMonth() + 1));  
    returnArr.push(formatNumber(date.getDate()));  

    returnArr.push(formatNumber(date.getHours()));  
    returnArr.push(formatNumber(date.getMinutes()));  
    returnArr.push(formatNumber(date.getSeconds()));  

    for (var i in returnArr)  
    {  
      format = format.replace(formateArr[i], returnArr[i]);  
    }  
    return format;  
} 

// 名字颜色，紫色。  #e906fd
// 内容颜色，黑色带点灰色。  #434243
// RMB颜色，金黄色。   #fdd102
// 金元颜色，绿色。    #2fbe46

cc.getGgRichString = function(itemdata){
  // 0: {id: "10", nickname: "海哥", amount: "17.50", type: "1", created_at: "1568635752"}
          //	1:金元，2:人民币元
    
      if (itemdata == null) {
        return "";
      }
      
      var lengthNickName = itemdata.nickname
      if (itemdata.nickname == null) {
        lengthNickName = "   "
      }
      var nickname = lengthNickName.slice(0,8)
      var text = "<color=#FF09F5>" + nickname + "  </c><color=#000000>在偷取红包中，获得 </c>";
      if ( Number(itemdata.type == 1)) {
          text = text + "<color=#2fbe46>" + itemdata.amount + "金元</color>";
      }else{
          text = text + "<color=#2fbe46>"+ itemdata.amount+ "元</color>";
      }
      return text;
  }
  cc.fenhongcenterRichString = function(itemdata)
  {
      if (itemdata == null) {
        return "";
      }
      var timeStr = cc.formatTime(itemdata.time,'Y/M/D h:m:s')
      var text = timeStr +  "    <color=#000000>恭喜</c>";
      if (Number(itemdata.type == 1)) {//1永久分红
          text = text + "<color=#008000>永久分红卡</color>";
      }else{//2 临时分红
        text = text + "<color=#008000>单次分红卡</color>";
      }
      text = text +  "<color=#000000>的持有者，每张已发放</c><color=#FF0000>"+ itemdata.amount +"</c><color=#000000>元</c>";
      return text;

  }
  
//根据id来获取龙的次数的
cc.geLongNumDataById = function (id){
// id: "10"
// long_id: "1001"
// num: "1"
// uid: "15"
    var data = null;
    var array = cc.UserInfo.long_num_List;
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
       // cc.log("====================index=",index);
        if (Number(element.long_id) == Number(id)) {
          data = element;
        
          break;
        }
    }

    return data;
}

//刷新各个常驻页面的金钱显示
cc.refreshMoneyShow = function(){
    cc.UserInfo.diamond = Number(cc.UserInfo.diamond).toFixed(2);
    cc.UserInfo.gold =  Number(cc.UserInfo.gold);
    cc.UserInfo.rmb =  Number(cc.UserInfo.rmb).toFixed(2);

    var fushuscript = cc.getPageSriptByIndx(1);
    if (fushuscript != null) {
      fushuscript.onRefreshDataShow();//刷新显示
    }
    var yanglongscript = cc.getPageSriptByIndx(2);
    if (yanglongscript != null) {
        yanglongscript.refreshUiShow();//刷新显示
    }
  
    var personpagescript = cc.getPageSriptByIndx(5);
    if (personpagescript != null) {
      personpagescript.refreshUiMoneyShow();//刷新显示
    }


}
cc.getPageSriptByIndx = function(indx)
{
   var nameList ={
     1:"fushupage",
     2:"yanglongpage",
     3:"shouyicenter",
     5:"personpage"
   }
    
   var pidList = {
    1:cc.PanelID.FUSHU_PAGE,
    2:cc.PanelID.MAIN_YANGLONG,
    3:cc.PanelID.MAIN_SY,
    5:cc.PanelID.PERSON_CNTER,
   }
   var mperfab = cc.allViewMap[cc.PanelID.MAIN_PAGE];
   if (mperfab == null) {
      return;
   }
   var mscript = mperfab.getComponent('mainpage');

   var perfab = cc.allViewMap[pidList[indx]];
   var script = null;
   if (perfab == null) {
       var page = mscript.getLayerByIndx(indx);
       var pnode = cc.UITools.findNode(page,nameList[indx]);
       if (pnode != null) {
        script = pnode.getComponent(nameList[indx]);
       }
      
   }else{
      script = perfab.getComponent(nameList[indx]);
   }

   return script

}





cc.setItemIcon = function(spriteName, sprite) {//设置物品icon
  if (spriteName == null || sprite == null) {
      cc.error("setItemIcon 有错",spriteName,sprite);
      return;
  }
  cc.atlasMgr.loadItemSpriteFrame(spriteName, null, sprite);
},
cc.setLongIcon = function(spriteName, sprite) {//设置龙的icon
  if (spriteName == null || sprite == null) {
    cc.error("setLongIcon 有错",spriteName,sprite);
    return;
}
  cc.atlasMgr.loadLongIconSpriteFrame(spriteName, null, sprite);
}


cc.removeLongItemInPage2ById = function(id)//养龙界面删除龙的
{
   
    var yanglongscript = cc.getPageSriptByIndx(2);
   
    if (yanglongscript == null) {
        cc.error("======yanglongscript error")
        return;
    }

    for (let i= 0; i < yanglongscript.longNodeList.length; i++) {
        const mperfab = yanglongscript.longNodeList[i];
        var mscript = mperfab.getComponent('longitem');
        if (mscript.getId() == id) {
            yanglongscript.longNodeList.splice(i,1);
            mperfab.destroy();
            break;
        }
    }
    
    cc.UserInfo.removeUserinfolong(id);//用户数据里面的一条long 

}

cc.itemTypeTransformPopType = function(itemType)
{
//// 1 获得金币   2 金币不足  3解锁龙的  4 回收魔龙的  5获得rmb的  6 获得物品的
//  这个奖励，包含：奖励ID，金额。
// 奖励ID所对应的类型=3，就是红包。
// 奖励ID所对应的类型=2，就是道具。
// 奖励ID所对应的类型=4，就是金币。
    var tabl = {
      3:5,
      2:6,
      4:1
    };
    var ty = tabl[itemType];
    return ty;
}

cc.getIsIphoneX = function()
{
   var flag = false;
   var windowSize =cc.view.getVisibleSize()
   
   var locCanvas = cc.game.canvas;
   var locContainer = cc.game.container;
   var sValue = locCanvas.height / locCanvas.width ;
   //  cc.log("getIsIphoneX ==",locCanvas,locContainer,cc.view._scaleY,cc.view)
     var sca = 0;
    if (sValue >= 1.999) {
      flag = true;
      if (cc.iphone_off_Y == 0) {
          if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_WINDOWS) 
          {
               sca = locCanvas.width / 720;
               var sca2 = locCanvas.height / 1280;
              // cc.log("===1===ssssss sca=",sca,sca2,locCanvas)
              cc.iphone_off_Y = (locCanvas.height -1280*cc.view._scaleY)/2;    
              if (cc.sys.os != cc.sys.OS_WINDOWS) {
                cc.iphone_off_Y = cc.iphone_off_Y / 4;
              }
          }
          else
          {
              cc.iphone_off_Y = (locCanvas.height -1280)/2;
              if (cc.iphone_off_Y < 0)
              {
                  // cc.iphone_off_Y = (locCanvas.height*2 -1280)/2;
                   sca = (locCanvas.width*2) / 720;
                  cc.iphone_off_Y = (locCanvas.height*2 -1280*sca)/2;   
                  //cc.log("====2==ssssss sca=",sca)
              }
          }
      }
      
    
    }
 //  cc.log(cc.sys.os,sca," cc.iphone_off_Y= ",cc.iphone_off_Y,flag);
  

  return flag;
}
 cc.iphone_off_Y = 0;//iphoneX 的偏差值



cc.showCommTip = function(str)
{
  var script = null;
  if (cc.mytiplayer != null) {
    script =  cc.mytiplayer.getComponent("tiplayer");
    script.showTip(str);
  }

}

//加载显示远程头像的
cc.loadUrlImg = function(container,headimg){
  // header("Access-Control-Allow-Origin:*");  
	// cc.loader.load(headimg, function (err, texture) {
	// 	var sprite  = new cc.SpriteFrame(texture);
	// 	container.spriteFrame = sprite;
  // });
  
  cc.loader.load({url:headimg,type:'jpg'},function(err,tex){
    container.spriteFrame = new cc.SpriteFrame(tex);
  })
//==============================================


cc.showSplashAD = function()
{
     //开屏广告
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
     
     cc.PerDelayDo(cc.rootpanel,delayCallBack,0.3,null);

}

  //显示插屏
  cc.showIAD = function()
  {

      if (cc.sys.os == cc.sys.OS_ANDROID) {
          jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showIAD', '()V');
      }
      else if (cc.sys.os == cc.sys.OS_IOS) {
      
      }

  }
  //显示bannerAd
  cc.showBannerAD = function()
  {
      if (cc.sys.os == cc.sys.OS_ANDROID) {
          jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showBannerAD', '()V');
      }
      else if (cc.sys.os == cc.sys.OS_IOS) {

      }

  }
  //关闭广告
  cc.closeBannerAD = function() {
      if (cc.sys.os == cc.sys.OS_ANDROID) {
          jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'destroyBannerAD', '()V');
      }
      else if (cc.sys.os == cc.sys.OS_IOS) {

      }

  }

  //请求打开视频
  cc.showRewardVideo = function(s)//1,2,3是显示腾讯视频
  {
      if (cc.sys.os == cc.sys.OS_ANDROID) {
          //jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showRewardVideo', '()V');
          jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showRewardVideo', '(Ljava/lang/String;)V',s);
         // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Test", "hello", "(Ljava/lang/String;)V", "this is a message from js");
          cc.UserInfo.limitTimeViedoFlag =  true;
          cc.UserInfo.limitTime = 1.0;
      }
      else if (cc.sys.os == cc.sys.OS_IOS) {

      }
      else{
        cc.getRewardVideo();
      }

  }

  //完成获得奖励
  cc.getRewardVideo = function()
  {
    if (cc.UserInfo.showVideoPage) {
      cc.UserInfo.showVideoPage.onFinishGetReward();
      cc.UserInfo.showVideoPage = null;
      cc.UserInfo.limitTimeViedoFlag =  true;
      cc.UserInfo.limitTime = 15;
     
    }

  }

} 

