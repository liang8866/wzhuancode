 'use strict';
 var JS = cc.js;
 var sproto = require("../Engine/sproto");
 var logger = cc.logger
/*
*	Network事件
*/
 var NetworkEvent = {
 	ON_NETWORK_OPEN: "ON_NETWORK_OPEN",
 	ON_NETWORK_DISCONNECTED: "ON_NETWORK_DISCONNECTED",
 	ON_NETWORK_CONNECT_FAILED: "ON_NETWORK_CONNECT_FAILED",
 };

 cc.NetworkEvent = NetworkEvent;

 /**
  * Network网络管理 网络收发
  *todo: 优化网络收发可以重用缓存， 不必每次都new 一个array?
  */
 var Network = function() {
    cc.EventTarget.call(this);
    this._socket = null;
    this._session = 0;

    //网络事件的分发没有用 EventTarget实现
    //网络事件都是放在唯一的Logic类中去处理， 所以一个事件只有一个唯一方法
    //多个事件处理网络方法，会导致逻辑比较混乱。
    this.c2s_process_fun = {};
    this.s2c_process_fun = {};

 };

 //for 事件订阅
 JS.extend(Network, cc.EventTarget);

 var proto = Network.prototype;
 /*
*c2s
*s2c
*/
proto.setProto = function(c2s_bin, s2c_bin) {
    var c2s_proto = sproto.createNew(c2s_bin);
    var s2c_proto = sproto.createNew(s2c_bin);

    this.c2s_proto = c2s_proto;
    this.s2c_proto = s2c_proto;

    s2c_proto.host();
    c2s_proto.host();

    var send_request = s2c_proto.attach(c2s_proto);
    var host_dispatch = s2c_proto.dispatch;

    this.send_request = send_request;
    this.host_dispatch = host_dispatch;
};

/*
*连接
*/
proto.connect = function(url){
    this._socket = new  cc.GameEngine.Socket();
    this._socket.on(cc.GameEngine.SocketEvent.OPEN, this._onSocketOpen, this);
    this._socket.on(cc.GameEngine.SocketEvent.CLOSE, this._onSocketClose, this);
    this._socket.on(cc.GameEngine.SocketEvent.MESSAGE, this._onSocketMessage, this);
    this._socket.on(cc.GameEngine.SocketEvent.ERROR, this._onSocketError, this);
    //暂时不需要写入缓存
    this._socket.disableInput = true;
    this._socket.connectByUrl(url);
};

proto.disConnect = function() {
    this.clearSocket(this._socket);
    if(this._socket != null) {
        this._socket.close();
        this._socket = null;
    }
    
    if(this.onSocketCloseCB != null) {
        this.onSocketCloseCB();
    }
    this.emit(NetworkEvent.ON_NETWORK_DISCONNECTED);
}

/*
*清除
*/
proto.clearSocket = function(socket){
    this._socket.off(cc.GameEngine.SocketEvent.OPEN, this._onSocketOpen, this);
    this._socket.off(cc.GameEngine.SocketEvent.CLOSE, this._onSocketClose, this);
    this._socket.off(cc.GameEngine.SocketEvent.MESSAGE, this._onSocketMessage, this);
    this._socket.off(cc.GameEngine.SocketEvent.ERROR, this._onSocketError, this);
};

/*
*
*/
proto._onSocketOpen = function(data){
    cc.log("_onSocketOpen");
    if(this.onSocketOpenCB != null) {
        this.onSocketOpenCB();
    }
    this.emit(NetworkEvent.ON_NETWORK_OPEN);
    this.lastRecvTime = (new Date()).getTime();
};

/*
*
*/
proto._onSocketClose = function(e){
    cc.log("_onSocketClose");
    this.clearSocket(this._socket);
    this._socket = null;
    if(this.onSocketCloseCB != null) {
        this.onSocketCloseCB();
    }
    this.emit(NetworkEvent.ON_NETWORK_DISCONNECTED);
};

/*
*
*/
proto._onSocketError = function(e){
    cc.log("onSocketError")
    cc.log(e)
    this.clearSocket(this.socket);
    this._socket = null;
    this.emit(NetworkEvent.ON_NETWORK_CONNECT_FAILED);
};

/*
*
*/
proto._onSocketMessage = function(data){
    //var dataArr = new Uint8Array(data.detail);
    var dataArr = new Uint8Array(data);
    var rets = this.host_dispatch(dataArr);
    var t = rets[0];
    var proto_name = rets[1];
    var prototab = rets[2];
    if(t == "REQUEST") {
        var fun = this.s2c_process_fun[proto_name];
        if(fun != null) {
            fun(prototab);
        }else {
            console.log("Network onSocketMessage not process request msg = " + proto_name);
        }
    }
    else if(t == "RESPONSE") {
        if(this.responseCallBack != null) {
            this.responseCallBack(proto_name, prototab);
        }
        var fun = this.c2s_process_fun[proto_name];
        if(fun != null) {
            fun(prototab);
        }else {
            console.log("Network onSocketMessage not process response msg = " + proto_name);
        }
    }
    else {
        cc.log("not process type t = " + t);
    }

    this.lastRecvTime = (new Date()).getTime();
   
};

/*
* @param protoName:协议名称
* @param data:数据
*/
proto.sendData = function(protoName, data){
    this._session++;
    var dataArr = this.send_request(protoName, data, this._session);
    //加载2个byte的长度( 不需要2个byte 的头了)
    //var len = data.length;
    //var len1 = (len >> 8) & 0xff;
    //var len2 = len & 0xff;
    //data.splice(0, 0, len2);
    //data.splice(0, 0, len1);

    var dataUnit8Arr = new Uint8Array(dataArr);
    //cc.log(dataUnit8Arr);
    if(this._socket != null) {
        this._socket.send(dataUnit8Arr);
    }
    return dataUnit8Arr;
};

proto.isNetConnect = function() {
    return this._socket != null;
}

/*
*增加C2S协议回调
* @param protoName:协议名称
* @param processFun:处理方法
* @param target:回调时候的对象
*/
proto.addC2SProtoProcess = function(protoName, processFun, target) {
    if(this.c2s_process_fun[protoName] != null) {
        logger.error("Network addC2SProtoProcess proto already register protoanme = ", protoName);
        return;
    }

    //TODO:检查下协议是否存在
    if(this.c2s_proto.queryproto(protoName)) {
        logger.error("Network addC2SProtoProcess proto not exist protoanme = ", protoName);
        return;
    }

    this.c2s_process_fun[protoName] = processFun;
};

/*
*增加S2C协议回调
* @param protoName:协议名称
* @param processFun:处理方法
* @param target:回调时候的对象
*/
proto.addS2CProtoProcess = function(protoName, processFun, target) {
    if(this.s2c_process_fun[protoName] != null) {
        logger.error("Network addS2CProtoProcess proto already register protoanme = ", protoName);
        return;
    }

    //TODO:检查下协议是否存在
    if(this.s2c_proto.queryproto(protoName)) {
        logger.error("Network addS2CProtoProcess proto not exist protoanme = ", protoName);
        return;
    }

    this.s2c_process_fun[protoName] = processFun;
};

/*
*增加协议回调
* @param protoName:协议名称
* @param processFun:处理方法
* @param target:回调时候的对象
*/
proto.addProtoProcess = function(c2s, s2c, target) {
    for(var key in c2s) {
        this.addC2SProtoProcess(key, c2s[key], target);
    }

    for(var key in s2c) {
        this.addS2CProtoProcess(key, s2c[key], target);
    }
    
};
/*
增加Response的回调接口
*/
proto.addResponseCB = function(cbFun) {
    this.responseCallBack = cbFun;
}

module.exports = Network;

