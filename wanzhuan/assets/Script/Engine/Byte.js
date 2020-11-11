'use strict';
var GameEngine = require('GameEngine');
var JS = cc.js;

/**
*
*<code>Byte</code> 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
*/
//class cc.GameEngine.Byte
/**
*
*<code>Byte</code> 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
*/
//class cc.GameEngine.Byte

var Byte = function(data) {
   /**
   * @property {Boolean} _xd_
   * @default true
   * @private
   */
    this._xd_ = true;
    this._allocated_ = 8;
    this._pos_ = 0;
    this._length = 0;
    this._u8d_ = null;
    this._d_ = null;
    this._length = 0;

    if (data) {
        this._u8d_ = new Uint8Array(data);
        this._d_ = new DataView(this._u8d_.buffer);
        this._length = this._d_.byteLength;
    } else {
        this.___resizeBuffer(this._allocated_);
    }
};

var prototype = Byte.prototype;
/**
 * !#en Get the ArrayBuffer data.
 * !#zh获取此对象的 ArrayBuffer数据,数据只包含有效数据部分 
 * @property {Array} buffer
 * @default nil
 * @example
 * var buff = b.buffer;
 */
/**
*。
*/
JS.get(prototype, 'buffer',
    function () {
        var rstBuffer = this._d_.buffer;
        if (rstBuffer.byteLength == this.length) return rstBuffer;
        return rstBuffer.slice(0, this.length);
    }
    //function (value) {
    //    this._name = value;
    //}
);

/**
*字节顺序。
*/
JS.getset(prototype, 'endian',
    function () {
        return this._xd_ ? "littleEndian" : "bigEndian";
    },
    function (endianStr) {
        this._xd_ = (endianStr == "littleEndian");
    },
);

/**
*字节长度。
*/
JS.getset(prototype, 'length',
    function () {
        return this._length;
    },
    function (value) {
        if (this._allocated_ < value)
            this.___resizeBuffer(this._allocated_ = Math.floor(Math.max(value, this._allocated_ * 2)));
        else if (this._allocated_ > value)
            this.___resizeBuffer(this._allocated_ = value);
        this._length = value;
    }
);

/**
*当前读取到的位置。
*/
JS.getset(prototype, 'pos',
    function () {
        return this._pos_;
    },
    function (value) {
        this._pos_ = value;
        this._d_.byteOffset = value;
    }
);

/**
*可从字节流的当前位置到末尾读取的数据的字节数。
*/
JS.get(prototype, 'bytesAvailable',
    function () {
        return this.length - this._pos_;
    }
);

//var prototype = Byte.prototype;
/**@private */
prototype.___resizeBuffer = function (len) {
    try {
        var newByteView = new Uint8Array(len);
        if (this._u8d_ != null) {
            if (this._u8d_.length <= len) newByteView.set(this._u8d_);
            else newByteView.set(this._u8d_.subarray(0, len));
        }
        this._u8d_ = newByteView;
        this._d_ = new DataView(newByteView.buffer);
    } catch (err) {
        throw "___resizeBuffer err:" + len;
    }
};

/**
*读取字符型值。
*@return
*/
prototype.getString = function () {
    return this.rUTF(this.getUint16());
};

/**
*从指定的位置读取指定长度的数据用于创建一个 Float32Array 对象并返回此对象。
*@param start 开始位置。
*@param len 需要读取的字节长度。
*@return 读出的 Float32Array 对象。
*/
prototype.getFloat32Array = function (start, len) {
    var v = new Float32Array(this._d_.buffer.slice(start, start + len));
    this._pos_ += len;
    return v;
};

/**
*从指定的位置读取指定长度的数据用于创建一个 Uint8Array 对象并返回此对象。
*@param start 开始位置。
*@param len 需要读取的字节长度。
*@return 读出的 Uint8Array 对象。
*/
prototype.getUint8Array = function (start, len) {
    var v = new Uint8Array(this._d_.buffer.slice(start, start + len));
    this._pos_ += len;
    return v;
};

/**
*从指定的位置读取指定长度的数据用于创建一个 Int16Array 对象并返回此对象。
*@param start 开始位置。
*@param len 需要读取的字节长度。
*@return 读出的 Uint8Array 对象。
*/
prototype.getInt16Array = function (start, len) {
    var v = new Int16Array(this._d_.buffer.slice(start, start + len));
    this._pos_ += len;
    return v;
};

/**
*在指定字节偏移量位置处读取 Float32 值。
*@return Float32 值。
*/
prototype.getFloat32 = function () {
    var v = this._d_.getFloat32(this._pos_, this._xd_);
    this._pos_ += 4;
    return v;
};

prototype.getFloat64 = function () {
    var v = this._d_.getFloat64(this._pos_, this._xd_);
    this._pos_ += 8;
    return v;
};

/**
*在当前字节偏移量位置处写入 Float32 值。
*@param value 需要写入的 Float32 值。
*/
prototype.writeFloat32 = function (value) {
    this.ensureWrite(this._pos_ + 4);
    this._d_.setFloat32(this._pos_, value, this._xd_);
    this._pos_ += 4;
};

prototype.writeFloat64 = function (value) {
    this.ensureWrite(this._pos_ + 8);
    this._d_.setFloat64(this._pos_, value, this._xd_);
    this._pos_ += 8;
};

/**
*在当前字节偏移量位置处读取 Int32 值。
*@return Int32 值。
*/
prototype.getInt32 = function () {
    var float = this._d_.getInt32(this._pos_, this._xd_);
    this._pos_ += 4;
    return float;
};

/**
*在当前字节偏移量位置处读取 Uint32 值。
*@return Uint32 值。
*/
prototype.getUint32 = function () {
    var v = this._d_.getUint32(this._pos_, this._xd_);
    this._pos_ += 4;
    return v;
};

/**
*在当前字节偏移量位置处写入 Int32 值。
*@param value 需要写入的 Int32 值。
*/
prototype.writeInt32 = function (value) {
    this.ensureWrite(this._pos_ + 4);
    this._d_.setInt32(this._pos_, value, this._xd_);
    this._pos_ += 4;
};

/**
*在当前字节偏移量位置处写入 Uint32 值。
*@param value 需要写入的 Uint32 值。
*/
prototype.writeUint32 = function (value) {
    this.ensureWrite(this._pos_ + 4);
    this._d_.setUint32(this._pos_, value, this._xd_);
    this._pos_ += 4;
};

/**
*在当前字节偏移量位置处读取 Int16 值。
*@return Int16 值。
*/
prototype.getInt16 = function () {
    var us = this._d_.getInt16(this._pos_, this._xd_);
    this._pos_ += 2;
    return us;
};

/**
*在当前字节偏移量位置处读取 Uint16 值。
*@return Uint16 值。
*/
prototype.getUint16 = function () {
    var us = this._d_.getUint16(this._pos_, this._xd_);
    this._pos_ += 2;
    return us;
};

/**
*在当前字节偏移量位置处写入 Uint16 值。
*@param value 需要写入的Uint16 值。
*/
prototype.writeUint16 = function (value) {
    this.ensureWrite(this._pos_ + 2);
    this._d_.setUint16(this._pos_, value, this._xd_);
    this._pos_ += 2;
};

/**
*在当前字节偏移量位置处写入 Int16 值。
*@param value 需要写入的 Int16 值。
*/
prototype.writeInt16 = function (value) {
    this.ensureWrite(this._pos_ + 2);
    this._d_.setInt16(this._pos_, value, this._xd_);
    this._pos_ += 2;
};

/**
*在当前字节偏移量位置处读取 Uint8 值。
*@return Uint8 值。
*/
prototype.getUint8 = function () {
    return this._d_.getUint8(this._pos_++);
};

/**
*在当前字节偏移量位置处写入 Uint8 值。
*@param value 需要写入的 Uint8 值。
*/
prototype.writeUint8 = function (value) {
    this.ensureWrite(this._pos_ + 1);
    this._d_.setUint8(this._pos_, value, this._xd_);
    this._pos_++;
};

/**
*@private
*在指定位置处读取 Uint8 值。
*@param pos 字节读取位置。
*@return Uint8 值。
*/
prototype._getUInt8 = function (pos) {
    return this._d_.getUint8(pos);
};

/**
*@private
*在指定位置处读取 Uint16 值。
*@param pos 字节读取位置。
*@return Uint16 值。
*/
prototype._getUint16 = function (pos) {
    return this._d_.getUint16(pos, this._xd_);
};

/**
*@private
*使用 getFloat32()读取6个值，用于创建并返回一个 Matrix 对象。
*@return Matrix 对象。
*/
prototype._getMatrix = function () {
    var rst = new Matrix(this.getFloat32(), this.getFloat32(), this.getFloat32(), this.getFloat32(), this.getFloat32(), this.getFloat32());
    return rst;
};

/**
*@private
*读取指定长度的 UTF 型字符串。
*@param len 需要读取的长度。
*@return 读出的字符串。
*/
prototype.rUTF = function (len) {
    var v = "", max = this._pos_ + len, c = 0, c2 = 0, c3 = 0, f = String.fromCharCode;
    var u = this._u8d_, i = 0;
    while (this._pos_ < max) {
        c = u[this._pos_++];
        if (c < 0x80) {
            if (c != 0) {
                v += f(c);
            }
        } else if (c < 0xE0) {
            v += f(((c & 0x3F) << 6) | (u[this._pos_++] & 0x7F));
        } else if (c < 0xF0) {
            c2 = u[this._pos_++];
            v += f(((c & 0x1F) << 12) | ((c2 & 0x7F) << 6) | (u[this._pos_++] & 0x7F));
        } else {
            c2 = u[this._pos_++];
            c3 = u[this._pos_++];
            v += f(((c & 0x0F) << 18) | ((c2 & 0x7F) << 12) | ((c3 << 6) & 0x7F) | (u[this._pos_++] & 0x7F));
        }
        i++;
    }
    return v;
};

/**
*字符串读取。
*@param len
*@return
*/
prototype.getCustomString = function (len) {
    var v = "", ulen = 0, c = 0, c2 = 0, f = String.fromCharCode;
    var u = this._u8d_, i = 0;
    while (len > 0) {
        c = u[this._pos_];
        if (c < 0x80) {
            v += f(c);
            this._pos_++;
            len--;
        } else {
            ulen = c - 0x80;
            this._pos_++;
            len -= ulen;
            while (ulen > 0) {
                c = u[this._pos_++];
                c2 = u[this._pos_++];
                v += f((c2 << 8) | c);
                ulen--;
            }
        }
    }
    return v;
};

/**
*清除数据。
*/
prototype.clear = function () {
    this._pos_ = 0;
    this.length = 0;
};

/**
*@private
*获取此对象的 ArrayBuffer 引用。
*@return
*/
prototype.__getBuffer = function () {
    return this._d_.buffer;
};

/**
*写入字符串，该方法写的字符串要使用 readUTFBytes 方法读取。
*@param value 要写入的字符串。
*/
prototype.writeUTFBytes = function (value) {
    value = value + "";
    for (var i = 0, sz = value.length; i < sz; i++) {
        var c = value.charCodeAt(i);
        if (c <= 0x7F) {
            this.writeByte(c);
        } else if (c <= 0x7FF) {
            this.writeByte(0xC0 | (c >> 6));
            this.writeByte(0x80 | (c & 63));
        } else if (c <= 0xFFFF) {
            this.writeByte(0xE0 | (c >> 12));
            this.writeByte(0x80 | ((c >> 6) & 63));
            this.writeByte(0x80 | (c & 63));
        } else {
            this.writeByte(0xF0 | (c >> 18));
            this.writeByte(0x80 | ((c >> 12) & 63));
            this.writeByte(0x80 | ((c >> 6) & 63));
            this.writeByte(0x80 | (c & 63));
        }
    }
};

/**
*将 UTF-8 字符串写入字节流。
*@param value 要写入的字符串值。
*/
prototype.writeUTFString = function (value) {
    var tPos = 0;
    tPos = this.pos;
    this.writeUint16(1);
    this.writeUTFBytes(value);
    var dPos = 0;
    dPos = this.pos - tPos - 2;
    this._d_.setUint16(tPos, dPos, this._xd_);
};

/**
*@private
*读取 UTF-8 字符串。
*@return 读出的字符串。
*/
prototype.readUTFString = function () {
    var tPos = 0;
    tPos = this.pos;
    var len = 0;
    len = this.getUint16();
    return this.readUTFBytes(len);
};

/**
*读取 UTF-8 字符串。
*@return 读出的字符串。
*/
prototype.getUTFString = function () {
    return this.readUTFString();
};

/**
*@private
*读字符串，必须是 writeUTFBytes 方法写入的字符串。
*@param len 要读的buffer长度,默认将读取缓冲区全部数据。
*@return 读取的字符串。
*/
prototype.readUTFBytes = function (len) {
    (len === void 0) && (len = -1);
    if (len == 0) return "";
    len = len > 0 ? len : this.bytesAvailable;
    return this.rUTF(len);
};

/**
*读字符串，必须是 writeUTFBytes 方法写入的字符串。
*@param len 要读的buffer长度,默认将读取缓冲区全部数据。
*@return 读取的字符串。
*/
prototype.getUTFBytes = function (len) {
    (len === void 0) && (len = -1);
    return this.readUTFBytes(len);
};

/**
*在字节流中写入一个字节。
*@param value
*/
prototype.writeByte = function (value) {
    this.ensureWrite(this._pos_ + 1);
    this._d_.setInt8(this._pos_, value);
    this._pos_ += 1;
};

/**
*@private
*在字节流中读一个字节。
*/
prototype.readByte = function () {
    return this._d_.getInt8(this._pos_++);
};

/**
*在字节流中读一个字节。
*/
prototype.getByte = function () {
    return this.readByte();
};

/**
*指定该字节流的长度。
*@param lengthToEnsure 指定的长度。
*/
prototype.ensureWrite = function (lengthToEnsure) {
    if (this._length < lengthToEnsure) this._length = lengthToEnsure;
    if (this._allocated_ < lengthToEnsure) this.length = lengthToEnsure;
};

/**
*写入指定的 Arraybuffer 对象。
*@param arraybuffer 需要写入的 Arraybuffer 对象。
*@param offset 偏移量（以字节为单位）
*@param length 长度（以字节为单位）
*/
prototype.writeArrayBuffer = function (arraybuffer, offset, length) {
    (offset === void 0) && (offset = 0);
    (length === void 0) && (length = 0);
    if (offset < 0 || length < 0) throw "writeArrayBuffer error - Out of bounds";
    if (length == 0) length = arraybuffer.byteLength - offset;
    this.ensureWrite(this._pos_ + length);
    var uint8array = new Uint8Array(arraybuffer);
    this._u8d_.set(uint8array.subarray(offset, offset + length), this._pos_);
    this._pos_ += length;
};


var BIG_ENDIAN = "bigEndian";
var LITTLE_ENDIAN = "littleEndian";
var _sysEndian = null;
prototype.getSystemEndian = function () {
    if (!_sysEndian) {
        var buffer = new ArrayBuffer(2);
        new DataView(buffer).setInt16(0, 256, true);
        _sysEndian = (new Int16Array(buffer))[0] === 256 ? /*CLASS CONST:cc.GameEngine.EndianEnum*/"littleEndian" :/*CLASS CONST:cc.GameEngine.EndianEnum.BIG_ENDIAN*/"bigEndian";
    }
    return _sysEndian;
}

//GameEngine.Byte = Byte;
GameEngine.Byte = module.exports = Byte;