var UserInfo = {

    hb_list:{},//红包列表
    sever_local_x:0,//服务器跟本地时间相差
    messageList:[],
    super_messageList:[],
    longList:[],//龙列表 get_long_data那边获取
    long_num_List:[],//龙的次数的 get_long_data 那边获取
    items_list:[],//物品表
    isWxLogin:false,
    
    
    // id	用户id	是	[string]	查看
    // 4	 parent_id		是	[string]	查看
    // 5	 mobile	手机号	是	[string]	查看
    // 6	 level	等级	是	[string]	查看
    // 7	 nickname	昵称	是	[string]	
    // 8	 rmb	人民币	是	[string]	查看
    // 9	 gold	金币	是	[string]	查看
    // 10	 diamond	钻石	是	[string]	查看
    // 11	 head	头像	是	[string]	
    // 12	 status	0表示正常	是	[string]	查看
    // 13	 ident	实名认证状态，2表示已完成实名认证，1表示已提交身份证信息	是	[string]	查看
    // 14	 rmb_jiasu	人民币加速次数	是	[string]	查看
    // 15	 video_jiasu	视频加速次数	是	[string]	查看
    // 16	 box_status	0或者小于当前时间都表示没有宝箱,1表示可领取,大于当前时间表示宝箱还剩余多长时间	是	[string]	查看
    // 17	 token		是	[string]	查看
    // 18	 cash_min	是否可提最小0.5金额（0可提，1不可提)	是	[string]	
    // 19	 steal_times	当天已偷次数	是	[string]	
    // 20	 hb_list	红包列表	是	[array]	
  
    adv_gold: "0",
    adv_times: 0,
    box_status: "",
    cash_min: "",
    diamond: "",
    explore_gold: "",
    explore_itemid: "",
    explore_times: "",
    gold: "0.00",
    guess: "0",
    guessf: "0",
    head: null,
    id: "",
    ident: "",
    level: "",
    mobile: "",
    nickname: null,
    parent_id: "",
    permanent: "",
    rmb: "",
    rmb_gets: "",
    rmb_jiasu: "",
    rmb_total: "0.00",
    server_time: 0,
    status: "0",
    steal_times: "0",
    token: "0",
    unionid: null,
    follow_mp:null,//是否关注了微信公众号，1表示关注了
    ident_gift:null,//1表示已经领取
   
    video_jiasu: "0",
    up_num:0,
    vip:0,//vip等级
    bonus_data:null,//	分红数据
    syData:null,//收益界面数据的
    jionteamData:null,
    nowVersion:"2.5.0",//当前版本，直接写死在这里的。版本更换要改这里
    onlineVersion:"",//网上最新版本
    versiondata:{},
    isShowNoticeFag:false,//是否在显示全局的通知页面
    signin:null,
    signin_time:null,
    level_reward:null,//等级现金领取的
    guideStep:null,//新手引导的
    showVideoPage:null,//自定义变量，那个页面点击开视频的

    limitTimeViedoFlag:false,//15秒限制看视频。默认false不限制
    limitTime:0,//剩余时间

    new_user:0,//是否是新用户
    invite_num:0,//邀请次数
    ident_xx:null,
    invite_rmb:0,//
    permanent:0,
    progress1:0,
    progress2:0,
    progress3:0,
    guideClick:false,//新手引导的点击

    friend_rmb:0,// 好友累计总收益
    jieduan:0,//阶第一段
    friend_rmb_level1:0,//徒弟贡献
    friend_rmb_level2:0,//徒孙

    market:0,//市场
    today_video_num:0,//  当天下线视频数量

};


UserInfo.clearData = function(){
    var self = this;
    self.hb_list={};//红包列表
    self.sever_local_x=0;//服务器跟本地时间相差
    self.messageList=[];
    self.super_messageList=[];
    self.longList=[];//龙列表 get_long_data那边获取
    self.long_num_List=[];//龙的次数的 get_long_data 那边获取
    self.items_list=[];//物品表
    self.isWxLogin=false;

    self.adv_gold= "0";
    self.adv_times= 0;
    self.box_status= "";
    self.cash_min= "";
    self.diamond= "";
    self.explore_gold= "";
    self.explore_itemid= "";
    self.explore_times= "";
    self.gold= "0.00";
    self.guess= "0";
    self.guessf= "0";
    self.head= null;
    self.id= "";
    self.ident= "";
    self.level= "";
    self.mobile= "";
    self.nickname= null;
    self.parent_id= "";
    self.permanent= "";
    self.rmb= "";
    self.rmb_gets= "";
    self.rmb_jiasu= "";
    self.rmb_total= "0.00";
    self.server_time= 0;
    self.status= "0";
    self.steal_times= "0";
    self.token= "0";
    self.unionid=null;
    self.follow_mp=null;//是否关注了微信公众号，1表示关注了
    self.ident_gift=null;//1表示已经领取
   
    self.video_jiasu= "0";
    self.up_num=0;
    self.vip=0;//vip等级
    self.bonus_data=null;//	分红数据
    self.syData=null;//收益界面数据的
    self.jionteamData=null;
    //self.nowVersion="2.1.2";//当前版本，直接写死在这里的。版本更换要改这里
    self.onlineVersion="";//网上最新版本
    self.versiondata={};
    self.isShowNoticeFag=false;//是否在显示全局的通知页面
    self.signin=null;
    self.signin_time=null;
    self.level_reward=null;//等级现金领取的
    self.guideStep=null;//新手引导的
    self.showVideoPage=null;//自定义变量，那个页面点击开视频的

    self.limitTimeViedoFlag=false;//15秒限制看视频。默认false不限制
    self.limitTime=0;//剩余时间

    self.new_user=0;//是否是新用户
    self.invite_num=0;//邀请次数
    self.ident_xx=null;
    self.invite_rmb=0;//
    self.permanent=0;
    self.progress1=0;
    self.progress2=0;
    self.progress3=0;
    self.guideClick=false;//新手引导的点击

    self.friend_rmb=0;// 好友累计总收益
    self.jieduan=0;//阶第一段
    self.friend_rmb_level1=0;//徒弟贡献
    self.friend_rmb_level2=0;//徒孙

    self.market=0;//市场
    self.today_video_num=0;//  当天下线视频数量

}


UserInfo.getLongListIndxByPosIdx  = function(posidx)//根据龙的位置获取它的数组下标
{
    for (let index = 0; index <  cc.UserInfo.longList.length; index++) {
        const element =  cc.UserInfo.longList[index];
        if (Number(element.index )== Number(posidx)) {
            
            return index;
        }
    }
    return -1;
},
UserInfo.getLongListIndxByid  = function(id)//根据龙的id获取它的数组下标
{
    for (let index = 0; index <  cc.UserInfo.longList.length; index++) {
        const element =  cc.UserInfo.longList[index];
        if (Number(element.id )== Number(id)) {
            
            return index;
        }
    }
    return -1;
},

UserInfo.addUserinfolong = function(itemData)//增加用户数据里面的一条long 
{
    if (itemData) {
        cc.UserInfo.longList.push(itemData)
    }

    var script2 = cc.getPageSriptByIndx(2);
    if (script2 != null) {
        script2.updateOutGetGoldSpeed();////更新显示获得金币速度
    }
   
}

UserInfo.removeUserinfolong = function(id)//删除用户数据里面的一条long 
{
    for (let i = 0; i< cc.UserInfo.longList.length; i++) {
        const element = cc.UserInfo.longList[i];
        if(Number(element.id) == Number(id))
        {
            cc.UserInfo.longList.splice(i,1);
            break;
        }
    }

    var script2 = cc.getPageSriptByIndx(2);
    if (script2 != null) {
        script2.updateOutGetGoldSpeed();////更新显示获得金币速度
    }
   
}

UserInfo.getItemIndxById = function(id)//根据物品的id获取到他的下标
{
    for (let index = 0; index <  cc.UserInfo.items_list.length; index++) {
        const element =  cc.UserInfo.items_list[index];
        if (Number(element.item_id )== Number(id)) {
            
            return index;
        }
    }
    return -1;
}

UserInfo.getItemNum = function(id)//根据物品的id获取到他的数量
{
    for (let index = 0; index <  cc.UserInfo.items_list.length; index++) {
        const element =  cc.UserInfo.items_list[index];
        if (Number(element.item_id )== Number(id)) {
            return element.num;
        }
    }
    return 0;
}

UserInfo.addItems = function(id,n) //增加物品
{
    var indx = cc.UserInfo.getItemIndxById(id);
    if (indx == -1) {//以前没有获得过
        var item = {
            item_id: id, 
            num: n
        }
        cc.UserInfo.items_list.push(item);
    }else{//以前获得过了
        cc.UserInfo.items_list[indx].num =  Number(cc.UserInfo.items_list[indx].num) + Number(n);//物品增加下
    }
   
    if(Number.parseInt(id) == 181 ||Number.parseInt(id) == 182)
    {
        var yanglongscript = cc.getPageSriptByIndx(2);
        if (yanglongscript != null) {
            yanglongscript.getLongData();//刷新显示
        }
    }
}

UserInfo.reduceItems =  function(id,n) 
{
    var indx = cc.UserInfo.getItemIndxById(id);
    if (indx ==  -1) {
        cc.error("你身上没有此物品",id);
    }else{
        cc.UserInfo.items_list[indx].num =  Number(cc.UserInfo.items_list[indx].num) - Number(n);//物品增加下
    }
}




cc.UserInfo = UserInfo;


