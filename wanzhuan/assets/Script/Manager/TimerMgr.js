/**
 * 定时器管理
 */
var TimerMgr = function(){
    //scheduleUpdate需要一个唯一的id
    //this.__instanceId = cc.ClassManager.getNewInstanceId();
};

var prototype = TimerMgr.prototype;
var timerMgr = new TimerMgr();


/**
 * 延迟调用
 */
prototype.delayCall = function(callFun, delayTime, params) {
    //schedule: function (callback, target, interval, repeat, delay, paused) {
    var delayCall = function() {
        callFun(params);
    }
    cc.director.getScheduler().schedule(delayCall, timerMgr, delayTime, 1);
}


cc.timerMgr = timerMgr;

