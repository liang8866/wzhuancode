'use strict';
var GameEngine = require('GameEngine');
var JS = cc.js;
/**
*<code>Socket</code> 是一种双向通信协议，在建立连接后，服务器和 Browser/Client Agent 都能主动的向对方发送或接收数据。
*/
//
var Socket = function (host, port, byteClass) {
    cc.EventTarget.call(this);
    this._endian = null;
    this._stamp = NaN;
    this._socket = null;
    this._connected = false;
    this._addInputPosition = 0;
    this._input = null;
    this._output = null;
    this.timeout = 0;
    this.objectEncoding = 0;
    this.disableInput = false;
    this._byteClass = null;
    this.endian = "bigEndian";

    (port === void 0) && (port = 0);
    //Socket.__super.call(this);
    this._byteClass = byteClass;
    this._byteClass = this._byteClass ? this._byteClass : cc.GameEngine.Byte;
    this.endian = "bigEndian";
    this.timeout = 20000;
    this._addInputPosition = 0;
    if (host && port > 0 && port < 65535)
        this.connect(host, port);

};

JS.extend(Socket, cc.EventTarget);

var proto = Socket.prototype;

/**
*表示服务端发来的数据。
* @property input
* @type {Object}
* @example
*/
JS.get(proto, 'input',
    function () {
        return this._input;
    }
);
    
/**
*表示需要发送至服务端的缓冲区中的数据。
* @property output
* @type {Object}
* @example
*/
JS.get(proto, 'output',
    function () {
        return this._output;
    }
);
    
/**
*表示此 Socket 对象目前是否已连接。
*/
JS.get(proto, 'connected',
    function () {
        return this._connected;
    }
);
    
/**
*表示数据的字节顺序。
*/
JS.getset(proto, 'endian',
    function () {
        return this._endian;
    },
    function (value) {
        this._endian = value;
        if (this._input != null) this._input.endian = value;
        if (this._output != null) this._output.endian = value;
    }
);
    
//var __proto=Socket.prototype;
/**
*连接到指定的主机和端口。
*@param host 服务器地址。
*@param port 服务器端口。
*/
proto.connect = function (host, port) {
    var url = "ws://" + host + ":" + port;
    this.connectByUrl(url);
};

/**
*连接到指定的url
*@param url 连接目标
*/
proto.connectByUrl = function (url) {
    var _$this = this;
    if (this._socket != null)
        this.close();
    this._socket && this._cleanSocket();
    this._socket = new WebSocket(url);
    this._socket.binaryType = "arraybuffer";
    //this._socket.binaryType = "blob";
    this._output = new this._byteClass();
    this._output.endian = this.endian;
    this._input = new this._byteClass();
    this._input.endian = this.endian;
    this._addInputPosition = 0;
    this._socket.onopen = function (e) {
        console.log("onopen state = " + _$this._socket.readyState);
        _$this._onOpen(e);
    };
    this._socket.onmessage = function (msg) {
        _$this._onMessage(msg);
    };
    this._socket.onclose = function (e) {
        _$this._onClose(e);
    };
    this._socket.onerror = function (e) {
        _$this._onError(e);
    };
};

proto._cleanSocket = function () {
    try {
        this._socket.close();
    } catch (e) { }
    this._connected = false;
    this._socket.onopen = null;
    this._socket.onmessage = null;
    this._socket.onclose = null;
    this._socket.onerror = null;
    this._socket = null;
};

/**
*关闭连接。
*/
proto.close = function () {
    if (this._socket != null) {
        this._cleanSocket();
    }
};

/**
*@private
*连接建立成功 。
*/
proto._onOpen = function (e) {
    console.log("_onOpen state = " + this._socket.readyState);
    this._connected = true;
    this.emit(/*cc.GameEngine.SocketEvent.OPEN*/"open", e);
};

/**
*@private
*接收到数据处理方法。
*@param msg 数据。
*/
proto._onMessage = function (msg) {
    if (!msg || !msg.data) return;
    var data = msg.data;
    if (this.disableInput && data) {
        this.emit(/*cc.GameEngine.SocketEvent.MESSAGE*/"message", data);
        return;
    }
    if (this._input.length > 0 && this._input.bytesAvailable < 1) {
        this._input.clear();
        this._addInputPosition = 0;
    };
    var pre = this._input.pos;
    !this._addInputPosition && (this._addInputPosition = 0);
    //this._input.pos = this._addInputPosition;
    if (data) {
        if ((typeof data == 'string')) {
            this._input.writeUTFBytes(data);
        } else {
            this._input.writeArrayBuffer(data);
        }
        this._addInputPosition = this._input.pos;
        //this._input.pos = pre;
    }
    this.emit(/*cc.GameEngine.SocketEvent.MESSAGE*/"message", data);
    //this.emit(/*cc.GameEngine.SocketEvent.MESSAGE*/"message", this._input.buffer);
};

/**
*@private
*连接被关闭处理方法。
*/
proto._onClose = function (e) {
    this._connected = false;
    this.emit(/*cc.GameEngine.SocketEvent.CLOSE*/"close", e)
};

/**
*@private
*出现异常处理方法。
*/
proto._onError = function (e) {
    this.emit(/*cc.GameEngine.SocketEvent.ERROR*/"error", e)
};

/**
*发送数据到服务器。
*@param data 需要发送的数据，可以是String或者ArrayBuffer。
*/
proto.send = function (data) {
    this._socket.send(data);
};

/**
*发送缓冲区中的数据到服务器。
*/
proto.flush = function () {
    if (this._output && this._output.length > 0) {
        var evt;
        try {
            this._socket && this._socket.send(this._output.__getBuffer().slice(0, this._output.length));
        } catch (e) {
            evt = e;
        }
        this._output.endian = this.endian;
        this._output.clear();
        if (evt) this.emit(/*cc.GameEngine.SocketEvent.ERROR*/"error", evt);
    }
};

//GameEngine.Socket = Socket
GameEngine.Socket = Socket;
 module.exports = Socket;
