//一些全局枚举的定义

//界面ID 的定义， 为了区别界面的唯一性
var PanelID = {
    LOADING_PAGE:0,//加载层
    MAIN_PAGE: 1,//主页面
    WX_LOGINPAGE:2,//微信登陆
    PW_LOGIN:3,//密码登陆
    REGISTER:4,//注册
    RESET_PW:5,//  忘记密码
    FUSHU_PAGE:6,//福树主页面
    OPEN_HONGBAO_PAGE:7,//点击打开红包页面
    OPEN_HONGBAO_PAGEDETAIL:8,//显示开红包页面详情
    STEALPAGE:9,//偷红包页面
    STAELHONGBAO:10,//偷到金元页面
    STEALCAICAI:11,//显示猜猜页面
    STEALCAI_ANSWER:12,//猜猜答案页面
    MAIN_DONGTAI:13,//动态显示的通告
    JIASU:14,//主界面的上的加速
    MAIN_BOX_PAGE:15,//主界面上的按钮BOX
    MAIN_DONGTAI:16,//主界面上的动态显示
    MAIN_YANGLONG:17,//养龙页面
    YL_POPUPPAGE:18,//养龙页面的弹窗
    YL_LONGDIAN:19,//龙店
    YL_TESUMOLONG:20,//特殊魔龙
    YL_GETHONGBAO:21,//获得红包
    YL_GETHONGBAODETAIL:22,//获得红包详情
    YL_FENHONGCENTER:23,//分红中心
    PERSON_CNTER:24,//个人中心
    PERSON_VIP:25,//VIP页面
    PERSON_TIXIAN:26,//提现
    YL_TANSUO:27,//探索
    YL_HETI:28,//合体
    YL_ZHUANPAN:29,//转盘
    YL_EXPLOREEXCHANGE:30,//探索兑换  
    YL_TESU_DUIHUAN:31,
    YL_TESU_HECHENG:32,
    PERSON_MONEYLOG:33,//提现记录
    PERSON_SETTING:34,//设置
    MAIN_SY:35,//收益界面
    SY_GUANZHU:36,//收益界面的点击关注出来的页面
    SY_SHAREWECHAT:37,//分享的
    SY_LOGPAGE:38,//收益记录界面
    PERSON_WANDUIWU:39,//玩赚队伍
    PERSON_TONGGAO:40,//通告
    PERSON_TONGGAODETAIL:41,//通告详情
    PERSON_jOINCOMMUNITY:42,//加入社群
    YL_TUJIAN:43,//图鉴
    NOTIC_PAGE:44,
    YL_WZACTIVE:45,//玩赚活动
    COM_SHOW_WEB:46,
    YL_YOUQING:47,//友情卡的
    COM_WENHAOPAGE:48,
    PERSON_IDNET:49,//身份证验证
    PERSON_TIXIANSHUOMING:50,//提现说明
    YL_GONGLIE:51,//攻略说明
    YL_SIGNSIN:52,//签到
    SY_INVITERULEPAGE:53,//邀请规则
    SY_INVITSECRETPAGE:54,//邀请秘诀
    GUIDE_SHOWINVITEPAGE:55,//引导邀请朋友的
    GUIDE_MAINPAGE:56,//新手引导层
    YL_BONUSCARRULE:57,//分红卡规则的   
    FUSHUFENHONGKADESC:58,
    SY_SHOUYIDESCPAGE:59,//收益说明的
    SY_BWDESC:60,//百万扶持说明
};

//PanleID 到 资源路径的Map
var PanelID2ResPath = {
    [PanelID.LOADING_PAGE]:"prefabs/loading/loadpage",
    [PanelID.MAIN_PAGE]: "prefabs/mainpage",//主页面
    [PanelID.WX_LOGINPAGE]: "prefabs/login/wxlogin",//微信登陆
    [PanelID.PW_LOGIN]: "prefabs/login/pwlogin",//密码登陆
    [PanelID.REGISTER]: "prefabs/login/register",//注册
    [PanelID.RESET_PW]: "prefabs/login/resetpassword",//忘记密码
    [PanelID.FUSHU_PAGE]:"prefabs/page1/fushupage",//福树主页面
    [PanelID.OPEN_HONGBAO_PAGE]:"prefabs/page1/openhongbao",//点击打开红包页面
    [PanelID.OPEN_HONGBAO_PAGEDETAIL]:"prefabs/page1/openhongbaodetail",//显示开红包页面详情
    [PanelID.STEALPAGE]:"prefabs/page1/stealpage",
    [PanelID.STAELHONGBAO]:"prefabs/page1/stealhongbao",
    [PanelID.STEALCAICAI]:"prefabs/page1/stealcaicai",
    [PanelID.STEALCAI_ANSWER]:"prefabs/page1/stealcaianswer",
    [PanelID.MAIN_DONGTAI]:"prefabs/page1/dongtai",
    [PanelID.JIASU]:"prefabs/page1/jiasupage",
    [PanelID.MAIN_BOX_PAGE]:"prefabs/page1/mainboxpage",
    [PanelID.MAIN_DONGTAI]:"prefabs/page1/dongtai",
    [PanelID.MAIN_YANGLONG]:"prefabs/page2/yanglongpage",
    [PanelID.YL_POPUPPAGE]:"prefabs/page2/popview",
    [PanelID.YL_LONGDIAN]:"prefabs/page2/longdian",
    [PanelID.YL_TESUMOLONG]:"prefabs/page2/tesumolong",
    [PanelID.YL_GETHONGBAO]:"prefabs/page2/gethongbao",
    [PanelID.YL_GETHONGBAODETAIL]:"prefabs/page2/gethongbaodetail",
    [PanelID.YL_FENHONGCENTER]:"prefabs/page2/fenhongcenter",
    [PanelID.PERSON_CNTER]:"prefabs/page5/personpage",
    [PanelID.PERSON_VIP]:"prefabs/page5/vippage",//VIP
    [PanelID.PERSON_TIXIAN]:"prefabs/page5/tixianpage",//提现
    [PanelID.YL_TANSUO]:"prefabs/page2/tansuo",//探索
    [PanelID.YL_HETI]:"prefabs/page2/heti",//合体
    [PanelID.YL_ZHUANPAN]:"prefabs/page2/zhuanpan",//幸运转盘
    [PanelID.YL_EXPLOREEXCHANGE]:"prefabs/page2/exploreExchange",//探索兑换
    [PanelID.YL_TESU_DUIHUAN]:"prefabs/page2/duihuangpage",//特殊魔龙的兑换
    [PanelID.YL_TESU_HECHENG]:"prefabs/page2/hechengpage",//特殊魔龙的合成
    [PanelID.PERSON_MONEYLOG]:"prefabs/page5/moneylogpage",//提现记录
    [PanelID.PERSON_SETTING]:"prefabs/page5/settingpage",//设置
    [PanelID.MAIN_SY]:"prefabs/page3/shouyicenter",//收益界面
    [PanelID.SY_GUANZHU]:"prefabs/page3/gzwechatpage",//收益界面的点击关注出来的页面
    [PanelID.SY_SHAREWECHAT]:"prefabs/page3/sharelayout",
    [PanelID.SY_LOGPAGE]:"prefabs/page3/shouyilogpage",//收益记录界
    [PanelID.PERSON_WANDUIWU]:"prefabs/page5/wanduiwupage",//玩赚队伍列表
    [PanelID.PERSON_TONGGAO]:"prefabs/page5/tonggaopage",//通告
    [PanelID.PERSON_TONGGAODETAIL]:"prefabs/page5/tonggaodetail",//通告详情
    [PanelID.PERSON_jOINCOMMUNITY]:"prefabs/page5/joincommunity",//加入社群
    [PanelID.YL_TUJIAN]:"prefabs/page2/tujianpage",//图鉴
    [PanelID.NOTIC_PAGE]:"prefabs/diaolog/noticepage",//
    [PanelID.YL_WZACTIVE]:"prefabs/page2/wzActive",//玩赚活动
    [PanelID.COM_SHOW_WEB]:"prefabs/diaolog/showWebPage",//
    [PanelID.YL_YOUQING]:"prefabs/page2/youqingpage",//友情卡
    [PanelID.COM_WENHAOPAGE]:"prefabs/diaolog/wenhaopage",//问号的
    [PanelID.PERSON_IDNET]:"prefabs/page5/nameident",//身份证验证
    [PanelID.PERSON_TIXIANSHUOMING]:"prefabs/page5/tixianshuoming",//提现说明
    [PanelID.YL_GONGLIE]:"prefabs/page2/gonglie",////攻略说明
    [PanelID.YL_SIGNSIN]:"prefabs/page2/signinpage",////签到
    [PanelID.SY_INVITERULEPAGE]:"prefabs/diaolog/inviteRluePage",//邀请规则
    [PanelID.SY_INVITSECRETPAGE]:"prefabs/page3/inviteSecretPage",//邀请秘诀
    [PanelID.GUIDE_SHOWINVITEPAGE]:"prefabs/guide/showInvitePage",
    [PanelID.GUIDE_MAINPAGE]:"prefabs/guide/guideLayer",//新手引导层
    [PanelID.YL_BONUSCARRULE]:"prefabs/diaolog/bonusCarRule",//分红卡规则的
    [PanelID.FUSHUFENHONGKADESC]:"prefabs/diaolog/fushuFenhongkaDesc",
    [PanelID.SY_SHOUYIDESCPAGE]:"prefabs/page3/shouyiDescPage",//收益说明的
    [PanelID.SY_BWDESC]:"prefabs/page2/baiwanshuoming",//百万扶持说明
   
}

cc.allViewMap = {}; //全局view 层显示的存放

cc.preLoadScriptList = { //用来预加载的
    [PanelID.YL_POPUPPAGE]:"popuppage",
    [PanelID.YL_LONGDIAN]:"longdian",
    [PanelID.YL_TESUMOLONG]:"molong",
    [PanelID.YL_FENHONGCENTER]:"fenhongcenter",
    //[PanelID.YL_GETHONGBAO]:"gethbpage",
    // [PanelID.YL_GETHONGBAODETAIL]:"gethongbaodetail",
    [PanelID.YL_TANSUO]:"tansuo",
    [PanelID.YL_HETI]:"heti",
    [PanelID.YL_ZHUANPAN]:"zhuanpan",
    [PanelID.YL_EXPLOREEXCHANGE]:"exploreExchange",
    [PanelID.YL_TESU_DUIHUAN]:"duihuan",
    [PanelID.YL_TESU_HECHENG]:"hecheng",
    [PanelID.YL_TUJIAN]:"tujianpage",
    [PanelID.OPEN_HONGBAO_PAGE]:"openhongbao",
    [PanelID.OPEN_HONGBAO_PAGEDETAIL]:"openhongbaodetail",
    [PanelID.STAELHONGBAO]:"stealhongbao",
    [PanelID.STEALCAICAI]:"stealcaicai",
   // [PanelID.STEALCAI_ANSWER]:"stealcaianswer",
    //[PanelID.JIASU]:"jiasupage",
    [PanelID.PERSON_TIXIAN]:"tixianpage",
    // [PanelID.YL_YOUQING]:"youqingpage",
   
   // [PanelID.YL_WZACTIVE]:"wzActive",
    //[PanelID.PERSON_MONEYLOG]:"moneylogpage",
   // [PanelID.PERSON_WANDUIWU]:"wanduiwupage",
   // [PanelID.PERSON_TONGGAO]:"tonggaopage",
    //[PanelID.PERSON_jOINCOMMUNITY]:"joincommunity",

    //[PanelID.SY_GUANZHU]:"guanzhuweixin",
   // [PanelID.SY_LOGPAGE]:"shouyilogpage",

};
	

//UI Panel所属的层级 层级越高 显示的越前面
var PanelLayer = {
    Layer1: 0,
    Layer2: 1,
    Layer3: 2,
    Layer4: 3,
};

//对应UI显示到的层
var PanelID2Layer = {
    [PanelID.LOGIN_PANEL]: 1,
    [PanelID.MAIN_PAGE]: 2,
 
};

//弹窗类型的  // 1 获得金币   2 金币不足  3解锁龙的  4 回收魔龙的  5获得rmb的  6 获得物品的
cc.popviewType = {
    getgold:1,
    lackgold:2,
    jiesuolong:3,
    huishoumolong:4,
    getrmb:5,
    getitems:6,
}

//一些常用颜色定义
cc.grayColor = new cc.Color(156, 154, 154);
cc.blueColor = new cc.Color(8, 243, 234);
cc.whiteColor = new cc.Color(255, 255, 255);
cc.yellowColor = new cc.Color(241, 232, 11);
cc.redColor = new cc.Color(255, 0, 0);
cc.greenColor = new cc.Color(3, 250, 26);

cc.MAX_LONG_LEVEL = 0;//最大的龙等级


cc.RecoverHpItem1 = 1007;
cc.RecoverHpItem2 = 1008;

cc.ReliveItem = 1009;

cc.LoginSvrURL = "ws://121.40.101.152:8080";
cc.GameSvrURL = "121.40.101.152";

// cc.LoginSvrURL = "ws://121.196.212.63:8888";
// cc.GameSvrURL = "121.196.212.63";
cc.PanelID = module.exports = PanelID;
cc.PanelID2ResPath = module.exports = PanelID2ResPath;
cc.PanelLayer = module.exports = PanelLayer;
cc.PanelID2Layer = module.exports = PanelID2Layer;

var basePostUrl ="http://dragon.wanlege.com"; //"http://123.207.244.209:81"//

var UrlTable ={
    url_bind_mobile: basePostUrl +"/api/bind-invite-mobile", //手机绑定邀请
    url_login_mobile:basePostUrl + "/user/login-by-mobile",//手机号码登录
    url_login_wx:basePostUrl + "/user/wechat-login",//微信登陆
    url_reg_code:basePostUrl + "/user/reg-code",//注册验证码
    url_reg_bymobile:basePostUrl + "/user/reg-by-mobile",//通过手机注册
    url_user_info:basePostUrl + "/user/user-info",//用户基础数据
    url_login_out:basePostUrl + "/user/login-out",//用户退出
    url_modify_pw:basePostUrl + "/user/modify-pw",//修改密码
    url_rest_phonecode:basePostUrl + "/user/reset",// 忘记密码-请求验证码
    url_rest_pw:basePostUrl + "/user/reset-done",//提交重置密码
    url_tixian:basePostUrl + "/user/cash-rmb",//提现
    url_step_first:basePostUrl + "/Ident/step-first",// 认证第一步，提交身份证信息
    //--------------------------------------------------
    url_hb_jiasu:basePostUrl + "/hb/jiasu",// 红包加速
    url_hb_giftbox:basePostUrl + "/hb/gift-box",// 领取宝箱
    url_hb_refresh_steal:basePostUrl + "/hb/refresh-steal",// 刷新一个偷红包玩家数据
    url_hb_steal:basePostUrl + "/hb/steal",//  偷红包
    url_hb_open:basePostUrl + "/hb/open",// 开红包
    url_hb_guess:basePostUrl +"/hb/guess",//猜红包
    url_hb_getmessage:basePostUrl +"/hb/get-message",//获取动态信息
    //------------------------------------
    url_long_summon:basePostUrl +"/long/summon",// 召唤龙
    url_long_get_long_data:basePostUrl +"/long/get-long-data",// 
    url_long_up_level:basePostUrl +"/long/up-level",// 龙升级
    url_long_change_index:basePostUrl +"/long/change-index",//  换位置
    url_long_swap_index:basePostUrl +"/long/swap-index",// 互换位置
    url_long_recover:basePostUrl +"/long/recover",//  回收龙
    url_long_merge:basePostUrl +"/long/merge",// 合体
    url_long_merge_element:basePostUrl +"/long/merge-element",//  合成元素之龙
    url_long_exchange_long:basePostUrl +"/long/exchange-long",// 兑换四像龙
    url_long_get_adv_gold:basePostUrl +"/long/gen-adv-gold",//  获得看广告的金币数
    url_long_adv_gold:basePostUrl +"/long/adv-gold",// 看完视频领取广告
    url_long_explore:basePostUrl +"/long/explore",// 探索
    url_long_explore_exchange_gold:basePostUrl +"/long/explore-exchange-gold",//  探索兑换金币
    url_long_get_gold:basePostUrl +"/long/gen-gold",//  每8秒一次金币
    url_long_zhuanpan:basePostUrl +"/long/zhuanpan",//  幸运转盘的
    url_get_moneylog:basePostUrl + "/user/rmb-log",//拉取钱包记录

    url_sy_mp_code:basePostUrl + "/profit/mp-code",//关注公众号 - 确认验证码
    url_sy_get_gift:basePostUrl + "/profit/get-gift",//领取奖励
    url_sy_get_tmp_card:basePostUrl + "/profit/get-tmp-card",//领取临时分红卡
    url_sy_profit_log:basePostUrl + "/profit/profit-log",//历史收益记录
    url_sy_profit_data:basePostUrl + "/profit/profit-data",//收益页面数据
    url_person_invite_list:basePostUrl + "/profit/invite-list",//下线列表
    url_person_news:basePostUrl + "/person/news",//通告
    url_person_jointeam:basePostUrl + "/person/join-team",//加入社群
    url_share_img:basePostUrl + "/person/invite-img",
    url_yl_profit_actives:basePostUrl + "/profit/actives",
    url_ident_data:basePostUrl + "/ident/ident-data",//当前数据
    url_submit_ident:basePostUrl + "/ident/submit-ident",//提交认证
    url_request_ad:basePostUrl + "/api/request-ad",//请求广告

    url_get_wetchat_mp:basePostUrl +"/profit/get-wechat-mp",//获取公众号
    url_get_youqingka_cfg:basePostUrl +"/long/yq-config",//获取友情卡的配置说明的
    
    url_long_signin:basePostUrl +"/person/signin",//签到
    url_long_level_reward:basePostUrl +"/person/level-reward",//等级奖励

    url_sy_ranklist:basePostUrl +"/profit/rank-list",//排行榜
    url_sy_invite_msg:basePostUrl +"/profit/invite-msg",//邀请信息
    url_yl_get_level_msg:basePostUrl +"/hb/get-level-message",
    
    url_new_user_reward:basePostUrl +"/person/new-user-reward",//新用户奖励 
    url_get_premanet_card:basePostUrl +"/profit/get-premanet-card",//领取分红卡
    url_get_card_log:basePostUrl + "/profit/card-log",

};
cc.UrlTable = UrlTable
