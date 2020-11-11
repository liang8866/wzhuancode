//游戏log
//由于调用cc.logger 调试时候输出的log 不能更好的追踪，所以log 还是直接用cc.log
var logger = {
    info: function() {
        //cc.log(arguments);
        console.log(arguments);
    },
    warn: function() {
        cc.warn(arguments);
    },
    error: function() {
        cc.error(arguments);
    },
};
cc.logger = logger;
module.exports = logger;
