'use strict';

var JS = cc.js;

/**
 * GameEngine命名空间
 * @moudle GameEngine
 * @main cc.GameEngine
 *游戏的一些底层基本模块的封装
 */
 var GameEngine = {};
 cc.GameEngine = GameEngine;

 /**
*大小端
*/
GameEngine.EndianEnum = cc.Enum({
	LITTLE_ENDIAN: "littleEndian",
    BIG_ENDIAN: "bigEndian",
});


/**
*Socket事件名称
*/
GameEngine.SocketEvent = cc.Enum({
	//打开
	OPEN: "open",
	//收到消息
	MESSAGE: "message",
	//关闭
	CLOSE: "close",
	//出错
	ERROR: "error",
});

module.exports = GameEngine;
require("GameLogger");
require ("Byte");
require ("Socket");
require("EventDispatcher");



