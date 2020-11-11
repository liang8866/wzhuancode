
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
if (!Uint8Array.prototype.slice) {
    Object.defineProperty(Uint8Array.prototype, 'slice', {
      value: Array.prototype.slice
    });
  }

//常量定义
var SPROTO_REQUEST = 0;
var SPROTO_RESPONSE = 1;

// type (sproto_arg.type)
var SPROTO_TINTEGER = 0;
var SPROTO_TBOOLEAN = 1;
var SPROTO_TSTRING = 2;
var SPROTO_TSTRUCT = 3;

// sub type of string (sproto_arg.extra)
var SPROTO_TSTRING_STRING = 0;
var SPROTO_TSTRING_BINARY = 1;

var SPROTO_CB_ERROR = -1;
var SPROTO_CB_NIL = -2;
var SPROTO_CB_NOARRAY = -3;

var SPROTO_TARRAY = 0x80;
var CHUNK_SIZE = 1000;
var SIZEOF_LENGTH = 4;
var SIZEOF_HEADER = 2;
var SIZEOF_FIELD = 2;

var ENCODE_BUFFERSIZE = 2050;
var ENCODE_MAXSIZE = 0x1000000;
var ENCODE_DEEPLEVEL = 64;

//js中只long只能表示到2^52-1, 0xFFFFFFFFFFFFF表示
function expand64(v){
    var value = v;
    if ((value & 0x80000000) != 0){
        value = 0x0000000000000 + (value & 0xFFFFFFFF);
    }
    return value;
}

function hi_low_uint64(low, hi){
    var value = (hi & 0xFFFFFFFF) * 0x100000000 + low;
    return value;
}

function int64_lshift(num, offset){
    return num * Math.pow(2, offset);
}

function uint64_rshift(num, offset){
    return Math.floor(num / Math.pow(2, offset));
}

function array_concat(a1, a2){
    var b = new Array();
    for (var i=0; i<a1.sz; i++){
        b[i] = a1.buf[i];
    }
    for (var j=a1.sz; j<a1.sz + a2.sz; j++){
        b[j] = a2.buf[j-a1.sz];
    }
    return {buf : b, sz: a1.sz+a2.sz};
};

function array2arraybuffer(array) {
    var b = new ArrayBuffer(array.length);
    var v = new DataView(b, 0);
    for (var i = 0; i < array.length; i++) {
        v.setUint8(i, array[i]);
    }
    return b;
};

function arraybuffer2array(buffer) {
    var v = new DataView(buffer, 0);
    var a = new Array();
    for (var i = 0; i < v.byteLength; i++) {
        a[i] = v.getUint8(i);
    }
    return a;
};

function string2utf8(str){
    var back = [];
    var byteSize = 0;
    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        if (0x00 <= code && code <= 0x7f) {
            byteSize += 1;
            back.push(code);
        } else if (0x80 <= code && code <= 0x7ff) {
            byteSize += 2;
            back.push((192 | (31 & (code >> 6))));
            back.push((128 | (63 & code)))
        } else if ((0x800 <= code && code <= 0xd7ff) || (0xe000 <= code && code <= 0xffff)) {
            byteSize += 3;
            back.push((224 | (15 & (code >> 12))));
            back.push((128 | (63 & (code >> 6))));
            back.push((128 | (63 & code)))
        }
    }
    for (i = 0; i < back.length; i++) {
        back[i] &= 0xff;
    }
    return back;
};

function utf82string(arr){
    if (typeof arr === 'string') {
        return null;
    }
    var UTF = '';
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == null){
            cc.log("error fatal");
        }
        var one = arr[i].toString(2);
        var v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += arr[st + i].toString(2).slice(2);
            }
            UTF += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            UTF += String.fromCharCode(arr[i]);
        }
    }
    return UTF;
};


function toword(stream){
    return (stream[0] & 0xff) | (stream[1] & 0xff) << 8;
};

function todword(stream){
    return ((stream[0] & 0xff) | (stream[1] & 0xff) << 8 | (stream[2] & 0xff) << 16 | (stream[3] & 0xff) << 24) >>> 0;
};

function count_array(stream){
    var length = todword(stream);
    var n = 0;
    stream = stream.slice(SIZEOF_LENGTH);
    while (length > 0) {
        var nsz;
        if (length < SIZEOF_LENGTH) {
            return -1;
        }
        nsz = todword(stream);
        nsz += SIZEOF_LENGTH;
        if (nsz > length) {
            return -1;
        }
        ++n;
        stream = stream.slice(nsz);
        length -= nsz;
    }
    return n;
};

function struct_field(stream, sz){
    var field, fn, header, i;
    if (sz < SIZEOF_LENGTH) {
        return -1;
    }
    fn = toword(stream);
    header = SIZEOF_HEADER + SIZEOF_FIELD * fn;
    if (sz < header) {
        return -1;
    }
    field = stream.slice(SIZEOF_HEADER);
    sz -= header;
    stream = stream.slice(header);
    for (i = 0; i < fn; i++) {
        var value = toword(field.slice(i * SIZEOF_FIELD + SIZEOF_HEADER));
        var dsz;
        if (value != 0) {
            continue;
        }
        if (sz < SIZEOF_LENGTH) {
            return -1;
        }
        dsz = todword(stream);
        if (sz < SIZEOF_LENGTH + dsz) {
            return -1;
        }
        stream = stream.slice(SIZEOF_LENGTH + dsz);
        sz -= SIZEOF_LENGTH + dsz;
    }
    return fn;
};

//stream 是arraybuffer
function import_string(s, stream) {
    var sz = todword(stream);
    var buffer = "";
    var arr = stream.slice(SIZEOF_LENGTH, SIZEOF_LENGTH + sz);
    for (var i = 0; i < arr.length; i++) {
        buffer += String.fromCharCode(arr[i]);
    }
    //buffer += '\0';
    return buffer;
};

function calc_pow(base, n){
    if (n == 0) return 1;
    var r = calc_pow(base * base , Math.floor(n / 2));
    if ((n & 1) != 0){
        r *= base;
    }
    return r;
};

function import_field(s, f, stream){
    var sz, result, fn;
    var array = 0;
    var tag = -1;
    f.tag = -1;
    f.type = -1;
    f.name = null;
    f.st = null;
    f.key = -1;
    f.extra = 0;

    sz = todword(stream);
    stream = stream.slice(SIZEOF_LENGTH);
    result = stream.slice(sz);
    fn = struct_field(stream, sz);
    if (fn < 0) return null;
    stream = stream.slice(SIZEOF_HEADER);
    for (var i=0; i<fn; i++){
        var value;
        ++tag;
        value = toword(stream.slice(SIZEOF_FIELD * i));
        if (value & 1 != 0){
            tag += Math.floor(value / 2);
            continue;
        }
        if (tag == 0){
            if (value != 0) return null;
            f.name = import_string(s, stream.slice(fn * SIZEOF_FIELD));
            continue;
        }
        if (value == 0) return null;
        value = Math.floor(value / 2) - 1;
        switch(tag){
        case 1: //buildin
            if (value >= SPROTO_TSTRUCT) {
            return null;
            }
            f.type = value;
            break;
        case 2: //type index
            if (f.type == SPROTO_TINTEGER){
                f.extra = calc_pow(10, value);
            } else if (f.type == SPROTO_TSTRING){
                f.extra = value; // string if 0 ; binary is 1
            } else {
                if (value >= s.type_n)  {
                  return null;
                }
                if (f.type >= 0) {
                  return null;
                }
                f.type = SPROTO_TSTRUCT;
                //f.st = s.type[value];
                f.st = value;
            }
            break;
        case 3: // tag
            f.tag = value;
            break;
        case 4: // array
            if (value != 0){
                array = SPROTO_TARRAY;
            } 
            break;
        case 5: // key
            f.key = value;
            break;
        default:
            return null;
        }
    }
    if (f.tag < 0 || f.type < 0 || f.name == null){
        return null;
    }
    f.type |= array;
    return result;
};

function import_type(s, t, stream){
    var result, fn, n, maxn, last;
    var sz = todword(stream);
    stream = stream.slice(SIZEOF_LENGTH);
    result = stream.slice(sz);
    fn = struct_field(stream, sz);
    if (fn <= 0 || fn > 2){
        return null;
    }
    for (var i=0; i<fn*SIZEOF_FIELD; i+=SIZEOF_FIELD){
        var v = toword(stream.slice(SIZEOF_HEADER + i));
        if (v != 0) return null;
    }
    t.name = null;
    t.n = 0;
    t.base = 0;
    t.maxn = 0;
    t.f = null;
    stream = stream.slice(SIZEOF_HEADER + fn * SIZEOF_FIELD);
    t.name = import_string(s, stream);
    if(fn == 1) {
      return result;
    }
    stream = stream.slice(todword(stream)+SIZEOF_LENGTH);
    n = count_array(stream);
    if (n < 0) {
      return null;
    }
    
    stream = stream.slice(SIZEOF_LENGTH);
    maxn = n;
    last = -1;
    t.n = n;
    t.f = new Array();
    for (var i=0; i<n; i++){
        var tag;
        t.f[i] = new Object();
        var f = t.f[i];
        stream = import_field(s, f, stream);
        if (stream == null) {
          return null;
        }
        tag = f.tag;
        if (tag <= last) {
          return null;
        }
        if (tag > last + 1) {
          ++maxn;
        }
        last = tag;
    }
    t.maxn = maxn;
    t.base = t.f[0].tag;
    n = t.f[n-1].tag - t.base + 1;
    if (n != t.n) {
        t.base = -1;
    }
    return result;
}

/*
.protocol {
	name 0 : string
	tag 1 : integer
	request 2 : integer
	response 3 : integer
}
*/
function import_protocol(s, p, stream){
    var result, sz, fn, tag;
    sz = todword(stream);
    stream = stream.slice(SIZEOF_LENGTH);
    result = stream.slice(sz);
    fn = struct_field(stream, sz);
    stream = stream.slice(SIZEOF_HEADER);
    p.name = null;
    p.tag = -1;
    p.p = new Array();
    p.p[SPROTO_REQUEST] = null;
    p.p[SPROTO_RESPONSE] = null;
    p.confirm = 0;
    tag = 0;
    for (var i=0; i<fn; i++,tag++){
        var value = toword(stream.slice(SIZEOF_FIELD * i));
        if (value & 1 != 0){
            tag += Math.floor(value-1)/2;
            continue;
        }
        value = Math.floor(value/2) - 1;
        switch(i){
        case 0: // name
            if (value != -1){
                return null;
            }
            p.name = import_string(s, stream.slice(SIZEOF_FIELD *fn));
            break;
        case 1: // tag
            if (value < 0){
               return null;
            }
            p.tag = value;
            break;
        case 2: // request
            if (value < 0 || value >= s.type_n)
                return null;
            p.p[SPROTO_REQUEST] = s.type[value];
            break;
        case 3: // response
            if (value < 0 || value >s.type_n)
                return null;
            p.p[SPROTO_RESPONSE] = s.type[value];
            break;
        case 4: // confirm
            p.confirm = value;
            break;
        default:
            return null;
        }
    }

    if (p.name == null || p.tag < 0){
        return null;
    }  
    return result;
}

function create_from_bundle(s, stream, sz){
    var content, typedata, protocoldata;
    var fn = struct_field(stream, sz);
    if (fn < 0 || fn > 2)
        return null;
    stream = stream.slice(SIZEOF_HEADER);
    content = stream.slice(fn*SIZEOF_FIELD);
    
    for(var i=0; i<fn; i++){
        var value = toword(stream.slice(i*SIZEOF_FIELD));
        if (value != 0) {
            return null;
        }
        var n = count_array(content);
        if (n < 0) {
            return null;
        }
        if (i == 0){
            typedata = content.slice(SIZEOF_LENGTH);
            s.type_n = n;
            s.type = new Array();
        }else {
            protocoldata = content.slice(SIZEOF_LENGTH);
            s.protocol_n = n;
            s.proto = new Array();
        }
        content = content.slice(todword(content) + SIZEOF_LENGTH);
    }
    for (var i=0; i<s.type_n; i++){
        s.type[i] = new Object();
        typedata = import_type(s, s.type[i], typedata);
        if (typedata == null){
            return null;
        }
    }

    for (var i=0; i<s.protocol_n; i++){
        s.proto[i] = new Object();
        protocoldata = import_protocol(s, s.proto[i], protocoldata);
        if (protocoldata == null){
            return null;
        }
    }
    return s;
};

function sproto_dump(s){

};

// query
function sproto_prototag(sp, name){
    for (var i=0; i<sp.protocol_n; i++){
        if (name == sp.proto[i].name){
            return sp.proto[i].tag;
        }
    }
    return -1;
}

function sproto_proto(sp, name){
    for (var i=0; i<sp.protocol_n; i++){
        if (name == sp.proto[i].name){
            return sp.proto[i];
        }
    }
    return -1;
}

// 二分查找
function query_proto(sp, tag){
    var begin = 0;
    var end = sp.protocol_n;
    while(begin < end){
        var mid = Math.floor((begin+end) / 2);
        var t = sp.proto[mid].tag;
        if (t == tag){
            return sp.proto[mid];
        }
        if (tag > t){
            begin = mid + 1;
        } else {
            end = mid;
        }
    }
    return null;
}

function sproto_protoquery(sp, proto, what){
    var p = null;
    if (what < 0 || what > 1){
        return null;
    }
    p = query_proto(sp, proto);
    if (p){
        return p.p[what];
    }
    return null;
}

function sproto_protoresponse(sp, proto){
    var p = query_proto(sp, proto);
    return (p != null && (p.p[SPROTO_RESPONSE] || p.confirm));
}

function sproto_protoname(sp, proto){
    var p = query_proto(sp, proto);
    if (p){
        return p.name;
    }
    return null;
}

function sproto_type(sp, type_name){
    for (var i=0; i<sp.type_n; i++){
        if (type_name == sp.type[i].name){
            return sp.type[i];
        }
    }
    return null;
}

function sproto_name(st){
    return st.name;
}

function findtag(st, tag){
    var begin, end;
    if (st.base >= 0){
        tag -= st.base;
        if (tag < 0 || tag > st.n){
            return null;
        }
        return st.f[tag];
    }
    begin = 0;
    end = st.n;
    while(begin < end){
        var mid = Math.floor((begin + end) / 2);
        var f = st.f[mid];
        var t = f.tag;
        if (t == tag){
            return f;
        }
        if (tag > t){
            begin = mid + 1;
        } else {
            end = mid;
        }
    }
    return null;
}

function fill_size(data, data_idx, sz){
    data[data_idx] = sz & 0xff;
	data[data_idx+1] = (sz >> 8) & 0xff;
	data[data_idx+2] = (sz >> 16) & 0xff;
	data[data_idx+3] = (sz >> 24) & 0xff;
	return sz + SIZEOF_LENGTH;
}

function encode_integer(v, data, data_idx, size){
    //if (size < SIZEOF_LENGTH + sizeof(v))
	//	return -1;
	data[data_idx+4] = v & 0xff;
	data[data_idx+5] = (v >> 8) & 0xff;
	data[data_idx+6] = (v >> 16) & 0xff;
	data[data_idx+7] = (v >> 24) & 0xff;
	return fill_size(data, data_idx, 4);
}

function encode_uint64(v, data, data_idx, size){
    //if (size < SIZEOF_LENGTH + sizeof(v))
	//	return -1;
	data[data_idx+4] = v & 0xff;
	data[data_idx+5] = uint64_rshift(v, 8) & 0xff;
	data[data_idx+6] = uint64_rshift(v, 16) & 0xff;
	data[data_idx+7] = uint64_rshift(v, 24) & 0xff;
	data[data_idx+8] = uint64_rshift(v, 32) & 0xff;
	data[data_idx+9] = uint64_rshift(v, 40) & 0xff;
	data[data_idx+10] = uint64_rshift(v, 48) & 0xff;
	data[data_idx+11] = uint64_rshift(v, 56) & 0xff;
	return fill_size(data, data_idx, 8);
}

/*
//#define CB(tagname,type,index,subtype,value,length) cb(ud, tagname,type,index,subtype,value,length)

static int
do_cb(sproto_callback cb, void *ud, const char *tagname, int type, int index, struct sproto_type *subtype, void *value, int length) {
	if (subtype) {
		if (type >= 0) {
			printf("callback: tag=%s[%d], subtype[%s]:%d\n",tagname,index, subtype->name, type);
		} else {
			printf("callback: tag=%s[%d], subtype[%s]\n",tagname,index, subtype->name);
		}
	} else if (index > 0) {
		printf("callback: tag=%s[%d]\n",tagname,index);
	} else if (index == 0) {
		printf("callback: tag=%s\n",tagname);
	} else {
		printf("callback: tag=%s [mainkey]\n",tagname);
	}
	return cb(ud, tagname,type,index,subtype,value,length);
}
#define CB(tagname,type,index,subtype,value,length) do_cb(cb,ud, tagname,type,index,subtype,value,length)
*/
function encode_object(cb, args, data, data_idx){
    var sz;
    //args.value = data_idx + SIZEOF_LENGTH;
    //传入 buffer代替原文的data指针
    args.buffer = data;
    args.buffer_idx = data_idx + SIZEOF_LENGTH;
    sz = cb(args);
    if (sz < 0){
        if (sz == SPROTO_CB_NIL){
            return 0;
        }
        return -1; // sz == SPROTO_CB_ERROR
    }
    return fill_size(data, data_idx, sz);
}

function uint32_to_uint64(negative, buffer, buffer_idx){
    if (negative) {
		buffer[buffer_idx+4] = 0xff;
		buffer[buffer_idx+5] = 0xff;
		buffer[buffer_idx+6] = 0xff;
		buffer[buffer_idx+7] = 0xff;
	} else {
		buffer[buffer_idx+4] = 0;
		buffer[buffer_idx+5] = 0;
		buffer[buffer_idx+6] = 0;
		buffer[buffer_idx+7] = 0;
	}
}

function encode_integer_array(cb, args, buffer, buffer_idx, noarray){
    var intlen, index;
    var header_idx = buffer_idx;
    
    buffer_idx++;
    intlen = 4;
    index = 1;
    noarray.value = 0;

    for (;;){
        var sz;
        args.value = null;
        args.length = 8;
        args.index = index;
        sz = cb(args);
        if (sz <= 0){
            if (sz == SPROTO_CB_NIL){
                break;
            }
            if (sz == SPROTO_CB_NOARRAY){
                noarray.value = 1;
                break;
            }
            return null;
        }
        
        if (sz == 4){
            var v = args.value;
            buffer[buffer_idx] = v & 0xff;
			buffer[buffer_idx+1] = (v >> 8) & 0xff;
			buffer[buffer_idx+2] = (v >> 16) & 0xff;
            buffer[buffer_idx+3] = (v >> 24) & 0xff;
            
            if (intlen == 8){
                uint32_to_uint64(v & 0x80000000, buffer, buffer_idx);
            }
        } else {
            var v;
            if (sz != 8){
                return null;
            }
            if (intlen == 4){
                buffer_idx += (index -1) * 4;
                for (var i=index-2; i>=0; i--){
                    var negative;
                    for (var j=1+i*8; j<1+i*8+4; j++){
                        header[j] = header[j-i*4];
                    }
                    negative = header[1+i*8+3] & 0x80;
                    uint32_to_uint64(negative, buffer, buffer_idx+1+i*8);
                }
                intlen = 8;
            }

            v = value;
            buffer[buffer_idx] = v & 0xff;
			buffer[buffer_idx+1] = (v >> 8) & 0xff;
			buffer[buffer_idx+2] = (v >> 16) & 0xff;
			buffer[buffer_idx+3] = (v >> 24) & 0xff;
			buffer[buffer_idx+4] = (v >> 32) & 0xff;
			buffer[buffer_idx+5] = (v >> 40) & 0xff;
			buffer[buffer_idx+6] = (v >> 48) & 0xff;
			buffer[buffer_idx+7] = (v >> 56) & 0xff;
        }

        buffer_idx += intlen;
        index++;
    }

    if (buffer_idx == header_idx+1){
        return header_idx;
    }
    buffer[header_idx] = intlen & 0xff;
    return buffer_idx;
}

function encode_array(cb, args, data, data_idx){
    var sz;
    var buffer = data;
    var buffer_idx = data_idx + SIZEOF_LENGTH;
    switch(args.type){
    case SPROTO_TINTEGER:{
        var noarray = {};
        noarray.value = 0;
        buffer_idx = encode_integer_array(cb, args, buffer, buffer_idx, noarray);
        if (buffer_idx == null){
            return -1;
        }
        if (noarray.value != 0){
            return 0;
        }
        break;
    }
    case SPROTO_TBOOLEAN:
        args.index = 1;
        for (;;){
            var v = 0;
            args.value = v;
            args.length = 4;
            sz = cb(args);
            if (sz < 0){
                if (sz == SPROTO_CB_NIL)
                    break;
                if (sz == SPROTO_CB_NOARRAY)
                    return 0;
                return -1;
            }
            if (sz < 1){
                return -1;
            }
            buffer[buffer_idx] = v ? 1 : 0;
            buffer_idx++;
            ++args.index;
        }
        break;
    default:
        args.index = 1;
        for (;;){
            args.buffer = buffer;
            args.buffer_idx = buffer_idx + SIZEOF_LENGTH;
            //args.value =  buffer_idx + SIZEOF_LENGTH;
            sz = cb(args);
            if (sz < 0){
                if (sz == SPROTO_CB_NIL){
                    break;
                }
                if (sz == SPROTO_CB_NOARRAY){
                    return 0;
                }
                return -1;
            }
            
            fill_size(buffer, buffer_idx, sz);
            buffer_idx += SIZEOF_LENGTH + sz;
            ++args.index;
        }
        break;
    }
    sz = buffer_idx - (data_idx + SIZEOF_LENGTH);
    if (sz == 0) {
        return 0;
    }
    return fill_size(buffer, data_idx, sz);
}



function decode_array_object(cb, args, stream, sz){
    var hsz;
    var index = 1;
    while(sz > 0){
        if (sz < SIZEOF_LENGTH){
            return -1;
        }
        hsz = todword(stream);
        stream = stream.slice(SIZEOF_LENGTH);
        sz -=  SIZEOF_LENGTH;
        if (hsz > sz){
            return -1;
        }
        args.index = index;
        args.value = stream;
        args.length = hsz;
        if (cb(args) != 0){
            return -1;
        }
        sz -= hsz;
        stream = stream.slice(hsz);
        ++index;
    }
    return 0;
}


function decode_array(cb, args, stream){
    var sz = todword(stream);
    var type = args.type;
    if (sz == 0){
        args.index = -1;
        args.value = null;
        args.length = 0;
        cb(args);
        return 0;
    }
    stream = stream.slice(SIZEOF_LENGTH);
    switch (type) {
    case SPROTO_TINTEGER: {
        var len = stream[0];
        stream = stream.slice(1);
        --sz;
        if (len == 4){
            if (sz % 4 != 0){
                return -1;
            }
            for (var i=0; i<Math.floor(sz/4); i++){
                var value = expand64(todword(stream.slice(i*4)));
                args.index = i+1;
                args.value = value;
                args.length = 8;
                cb(args);
            }
        } else if(len == 8){
            if (sz % 8 != 0){
                return -1;
            }
            for (var i=0; i<Math.floor(sz/8); i++){
                var low = todword(stream.slice(i*8));
                var hi = todword(stream.slice(i*8 + 4));
                var value = hi_low_uint64(low, hi);
                args.index = i+1;
                args.value = value;
                args.length = 8;
                cb(args);
            }
        } else {
            return -1;
        }
        break;
    }
    case SPROTO_TBOOLEAN:
        for (var i=0; i<sz; i++){
            var value = stream[i];
            args.index = i+1;
            args.value = value;
            args.length = 8;
            cb(args);
        }
        break;
    case SPROTO_TSTRING:
    case SPROTO_TSTRUCT:
        return decode_array_object(cb, args, stream, sz);
    default:
        return -1;
    }
    return 0;
}

function pack_seg(src, src_idx,  buffer, buffer_idx, sz, n){
    var header = 0;
    var notzero = 0;
    var obuffer_idx = buffer_idx;
    buffer_idx++;
    sz--;
    if (sz < 0){
        obuffer_idx = null;
    }
    for (var i=0; i<8; i++){
        if (src[src_idx+i] != 0){
            notzero++;
            header |= 1 << i;
            if (sz > 0){
                buffer[buffer_idx] = src[src_idx+i];
                ++buffer_idx;
                --sz;
            }
        }
    }
    if ((notzero == 7 || notzero == 6) && n > 0) {
		notzero = 8;
    }
    
    if (notzero == 8){
        if(n > 0){
            return 8;
        } else {
            return 10;
        }
    }
    if (obuffer_idx != null){
        buffer[obuffer_idx] = header;
    }
    return notzero + 1;
}

function write_ff(src, src_idx, des, dest_idx, n){
    var align8_n = (n+7)&(~7);
    des[dest_idx] = 0xff;
    des[dest_idx+1] = Math.floor(align8_n/8) - 1;
    for (var i=0; i<n; i++){
        des[dest_idx+i+2] = src[src_idx+i];
    }
    for (var i=0; i<align8_n-n; i++){
        des[dest_idx+n+2+i] = 0;
    }
}

function sproto_pack(srcv, src_idx, bufferv, buffer_idx){
    var tmp = new Array(8);
    var ff_srcstart, ff_desstart;
    //ff_srcstart = new Array();
    var ff_srcstart_idx = 0;
    var ff_desstart_idx = 0;
    var ff_n = 0;
    var size = 0;
    var src = srcv;
    var buffer = bufferv;
    var srcsz = srcv.length;
    var bufsz = 1 << 30;
    //按照8个字节一组做压缩 一个字节 表示各个字节是否为0
    for (var i=0; i<srcsz; i+=8){
        var n;
        var padding = i+8 -srcsz;
        if (padding > 0){
            //数据长度不是8的倍数， 补上0 
            //memcpy(tmp, src, 8-padding)
            for (var j=0; j<8-padding; j++){
                tmp[j] = src[src_idx+j];
            }
            for (var j=0; j<padding; j++){
                tmp[7-j] = 0;
            }
            src = tmp;
            src_idx = 0;
        }
        n = pack_seg(src, src_idx, buffer, buffer_idx, bufsz, ff_n);
        bufsz -= n;
        if (n == 10){
            ff_srcstart = src;
            ff_srcstart_idx = src_idx;
            ff_desstart = buffer;
            ff_desstart_idx = buffer_idx;
            ff_n = 1;
        } else if(n == 8  && ff_n > 0){
            ++ff_n;
            if (ff_n == 256){
                if (bufsz >= 0){
                    write_ff(ff_srcstart, ff_srcstart_idx, ff_desstart, ff_desstart_idx, 256*8);
                }
                ff_n = 0;
            }
        } else {
            if (ff_n > 0){
                if (bufsz >= 0){
                    write_ff(ff_srcstart, ff_srcstart_idx, ff_desstart, ff_desstart_idx, ff_n*8);
                }
                ff_n = 0;
            }
        }
        src_idx += 8;
        buffer_idx += n;
        size += n;
    }
    if (bufsz >= 0){
        if (ff_n == 1){
            write_ff(ff_srcstart, ff_srcstart_idx, ff_desstart, ff_desstart_idx, 8);
        } else if(ff_n > 1){
            write_ff(ff_srcstart, ff_srcstart_idx, ff_desstart, ff_desstart_idx, srcsz-ff_srcstart_idx);
        }
    }
    return size;
}

function sproto_unpack(srcv, src_idx, bufferv, buffer_idx){
    var src = srcv;
    var buffer = bufferv;
    var size = 0;
    var srcsz = srcv.length;
    var bufsz = 1 << 30;
    while (srcsz > 0){
        var header = src[src_idx];
        --srcsz;
        ++src_idx;
        if (header == 0xff){
            var n;
            if (srcsz < 0){
                return -1;
            }
            n = (src[src_idx] + 1) * 8;
            if (srcsz < n + 1)
                return -1;
            srcsz -= n + 1;
            ++src_idx;
            if (bufsz >= n){
                //memcpy(buffer, src, n);
                for (var i=0; i<n; i++){
                    buffer[buffer_idx+i] = src[src_idx+i];
                }
            }
            bufsz -= n;
            buffer_idx += n;
            src_idx += n;
            size += n;
        } else {
            for (var i=0; i<8; i++){
                var nz = (header >>> i) & 1;
                if (nz != 0){
                    if (srcsz < 0)
                        return -1;
                    if (bufsz > 0){
                        buffer[buffer_idx] = src[src_idx];
                        --bufsz;
                        ++buffer_idx;
                    }
                    ++src_idx;
                    --srcsz;
                } else {

                    if (bufsz > 0){
                        buffer[buffer_idx] = 0;
                        --bufsz;
                        ++buffer_idx;
                    }

                    // if (srcsz <= 0){
                    //     break;
                    // }
                    
                }
                ++size;
            }
        }
    }
    return size;
}



var Sproto = {

    pack : function(inbuf){
        var src_idx = 0;
        var buffer = new Array();
        var buffer_idx = 0;
        var size = sproto_pack(inbuf, src_idx, buffer, buffer_idx);
        return buffer.slice(0, size);
    },

    packWitchHeader : function(header, content) {
        var src_idx = 0;
        var buffer = new Array();
        var buffer_idx = 0;
        var size = sproto_pack(header, src_idx, buffer, buffer_idx);

        //pack content
        sproto_pack(content, 0, buffer, size);
        return buffer;
    },

    unpack : function(inbuf){
        var src_idx = 0;
        var buffer = new Array();
        var buffer_idx = 0;
        var size = sproto_unpack(inbuf, src_idx, buffer, buffer_idx);
        return buffer.slice(0, size);
    },
    
    createNew : function(binsch){
        var s = {};
        var result = new Object();
        var __session = new Array();
        var header_tmp = {};
        var enbuffer;
        s.type_n = 0;
        s.protocol_n = 0;
        s.type = null;
        s.proto = null;
        var sp = create_from_bundle(s, binsch, binsch.length);
        sp.__session = __session;
        if (sp == null) return null;

        function sproto_encode(st, buffer, buffer_idx, cb, ud){
            var args = new Object();
            var header_idx = buffer_idx;
            var data_idx = buffer_idx;
            var header_sz = SIZEOF_HEADER + st.maxn * SIZEOF_FIELD;
            var index, lasttag, datasz;
        
            args.ud = ud;
            data_idx = header_idx + header_sz;
            index = 0;
            lasttag = -1;
            for (var i = 0; i < st.n; i++){
                var f = st.f[i];
                var type = f.type;
                var value = 0;
                var sz = -1;
                args.tagname = f.name;
                args.tagid = f.tag;
                if (f.st != null) {
                    args.subtype = sp.type[f.st];
                } else {
                    args.subtype = null;
                }
                
                args.mainindex = f.key;
                args.extra = f.extra;
                var type_ret = type & SPROTO_TARRAY;
                if ((type & SPROTO_TARRAY) != 0){
                    args.type = type & ~ SPROTO_TARRAY;
                    sz = encode_array(cb, args, buffer, data_idx);
                } else {
                    args.type = type;
                    args.index = 0;
                    switch(type){
                    case SPROTO_TINTEGER:
                    case SPROTO_TBOOLEAN: {
                        args.value = 0;
                        args.length = 8;
                        args.buffer = buffer;
                        args.buffer_idx = buffer_idx;
                        sz = cb(args);
                        if (sz < 0){
                            if (sz == SPROTO_CB_NIL)
                                continue;
                            if (sz == SPROTO_CB_NOARRAY)
                                return 0; // no array, don't encode it
                            return -1; // sz == SPROTO_CB_ERROR
                        }
                        if (sz == 4){
                            if (args.value < 0x7fff){
                                value = (args.value + 1) * 2;
                                sz = 2;
                            } else {
                                sz = encode_integer(args.value, buffer, data_idx, sz);
                            }
                        } else if(sz == 8){
                            sz = encode_uint64(args.value, buffer, data_idx, sz);
                        } else {
                            return -1;
                        }
                        break;
                    }
                    case SPROTO_TSTRUCT:
                    case SPROTO_TSTRING:
                        sz = encode_object(cb, args, buffer, data_idx);
                        break;
                    }
                }
                if (sz < 0)
                    return -1;
                if (sz > 0){
                    var record_idx, tag;
                    if (value == 0){
                        data_idx += sz;
                    }
                    record_idx = header_idx + SIZEOF_HEADER + SIZEOF_FIELD * index;
                    tag = f.tag - lasttag - 1;
                    if (tag > 0){
                        tag = (tag - 1) * 2 + 1;
                        if (tag > 0xffff)
                            return -1;
                        buffer[record_idx] = tag & 0xff;
                        buffer[record_idx+1] = (tag >> 8) & 0xff;
                        ++index;
                        record_idx += SIZEOF_FIELD;
                    }
                    ++index;
                    buffer[record_idx] = value & 0xff;
                    buffer[record_idx+1] = (value >> 8) & 0xff;
                    lasttag = f.tag;
                }
            }
        
            buffer[header_idx] = index & 0xff;
            buffer[header_idx+1] = (index >> 8) & 0xff;
            
            datasz = data_idx - (header_idx + header_sz);
            data_idx = header_idx + header_sz;
            if (index != st.maxn){
                //memmove(header + SIZEOF_HEADER + index * SIZEOF_FIELD, data, datasz);
                var v = buffer.slice(data_idx, data_idx+datasz);
                for (var s = 0; s < v.length; s++){
                    buffer[header_idx + SIZEOF_HEADER + index * SIZEOF_FIELD + s] = v[s];
                }
                var remove_size = buffer.length - (header_idx + SIZEOF_HEADER + index * SIZEOF_FIELD + v.length);
                buffer.splice(header_idx + SIZEOF_HEADER + index * SIZEOF_FIELD + v.length, buffer.length);
            }
        
            return SIZEOF_HEADER + index * SIZEOF_FIELD + datasz;
        }

        function encode(args){
            var self = args.ud;
            if (self.deep >= ENCODE_DEEPLEVEL){
                alert("table is too deep");
                return -1;
            }
        
            if (self.indata[args.tagname] == null){
                return SPROTO_CB_NIL;
            }
            //array
            var target = null;
            if (args.index > 0){
                // a new array
                if (args.tagname != self.array_tag){
                    self.array_tag = args.tagname;
        
                    if (typeof(self.indata[args.tagname]) != "object"){
                        self.array_index = 0;
                        return SPROTO_CB_NIL;
                    }
        
                    if (self.indata[args.tagname].length == 0 || self.indata[args.tagname].length == null){
                        self.array_index = 0;
                        return SPROTO_CB_NOARRAY;
                    }
                }
                target = self.indata[args.tagname][args.index - 1];
                if (target == null){
                    return SPROTO_CB_NIL;
                }
            }
            else{
                target = self.indata[args.tagname];
            }
        
            switch(args.type) {
            case SPROTO_TINTEGER:{
                var v, vh, isnum;
                if (args.extra > 0){ //小数位
                    var vn = target;
                    v = Math.floor(vn * args.extra + 0.5);
                } else {
                    v = target;
                }
                vh = uint64_rshift(v, 31);
                if (vh == 0 || vh == -1){
                    args.value = v & 0xFFFFFFFF;
                    return 4;
                } else {
                    args.value = v;
                    return 8;
                }
            }
            case SPROTO_TBOOLEAN:{
                args.value = target;
                return 4;
            }
            case SPROTO_TSTRING:{
                var str = target;
                var arr = string2utf8(str);
                var sz = arr.length;
                //todo: no need to expend buff...
                //if (sz > args.length){
                //    return SPROTO_CB_ERROR;
                //}
                
                for (var i = 0; i < arr.length; i++) {
                    args.buffer[args.buffer_idx + i] = arr[i];
                }
                return sz;
            }
            case SPROTO_TSTRUCT:{
                var sub = new Object();
                sub.st = args.subtype;
                sub.deep = self.deep + 1;
                sub.indata = target;
                var r = sproto_encode(args.subtype, args.buffer, args.buffer_idx, encode, sub);
                if (r < 0){
                    return SPROTO_CB_ERROR;
                }
                return r;
            }
            default:
                alert("Invalid filed type "+args.type);
                return SPROTO_CB_ERROR;
            }
        }
        
        function sproto_decode(st, data, size, cb, ud){
            var args = new Object();
            var total = size;
            var stream, datastream, fn, tag;
            if (size < SIZEOF_HEADER) return -1;
            stream = data.slice(0); // 相当于memcopy(dest, stream, stream.length)
            fn = toword(stream);
            stream = stream.slice(SIZEOF_HEADER);
            size -= SIZEOF_HEADER;
            if (size < fn * SIZEOF_FIELD)
                return -1;
            datastream = stream.slice(fn * SIZEOF_FIELD);
            size -= fn * SIZEOF_FIELD;
            args.ud = ud;
        
            tag = -1;
            for(var i=0; i<fn; i++){
                var currentdata = null;
                var f = null;
                var value = toword(stream.slice(i * SIZEOF_FIELD));
                ++tag;
                if (value & 1 != 0){
                    tag += Math.floor(value/2);
                    continue;
                }
                value = Math.floor(value/2) -1;
                currentdata = datastream.slice(0);
                if (value < 0) {
                    var sz;
                    if (size < SIZEOF_LENGTH) {
                        return -1;
                    }
                    sz = todword(datastream);
                    if (size < sz + SIZEOF_LENGTH) {
                        return -1;
                    }
                    datastream = datastream.slice(sz + SIZEOF_LENGTH);
                    size -= sz + SIZEOF_LENGTH;
                }
                f = findtag(st, tag);
                if (f == null) {
                    continue;
                }
                args.tagname = f.name;
                args.tagid = f.tag;
                args.type = f.type & ~SPROTO_TARRAY;
                if (f.st != null){
                    args.subtype = sp.type[f.st];
                } else {
                    args.subtype = null;
                }
                
                args.index = 0;
                args.mainindex = f.key;
                args.extra = f.extra;
                if (value < 0){
                    if ((f.type & SPROTO_TARRAY) != 0){
                        if (decode_array(cb, args, currentdata)){
                            return -1;
                        }
                    } else {
                        switch(f.type){
                        case SPROTO_TINTEGER:{
                            var sz = todword(currentdata);
                            if (sz == 4){
                                var v = expand64(todword(currentdata.slice(SIZEOF_LENGTH)));
                                args.value = v;
                                args.length = 8;
                                cb(args);
                            } else if(sz != 8){
                                return -1;
                            } else {
                                var low = todword(currentdata.slice(SIZEOF_LENGTH));
                                var hi = todword(currentdata.slice(SIZEOF_LENGTH + 4));
                                var v = hi_low_uint64(low, hi);
                                args.value = v;
                                args.length = 8;
                                cb(args);
                            }
                            break;
                        }
                        case SPROTO_TSTRING:
                        case SPROTO_TSTRUCT: {
                            var sz = todword(currentdata);
                            args.value = currentdata.slice(SIZEOF_LENGTH);
                            args.length = sz;
                            if (cb(args) != 0){
                                return -1;
                            }
                            break;
                        }
                        default:
                            return -1;
                        }
                    }
                } else if(f.type != SPROTO_TINTEGER && f.type != SPROTO_TBOOLEAN){
                    return -1;
                } else {
                    args.value = value;
                    args.length = 8;
                    cb(args);
                }
            }
            return total - size;
        }

        function decode(args){
            var self = args.ud;
            var value;
            if (self.deep >= ENCODE_DEEPLEVEL){
                alert("the table is too deep");
            }
            if (args.index != 0){
                // It's array
                if (args.tagname != self.array_tag){
                    self.array_tag = args.tagname;
                    self.result[args.tagname] = new Array();
                    if (args.index < 0){
                        return 0;
                    }
                }
            }
            switch(args.type){
            case SPROTO_TINTEGER:{
                if (args.extra){
                    var v = args.value;
                    var vn = v;
                    value = vn / args.extra;
                } else {
                    value = args.value;
                }
                break;
            }
            case SPROTO_TBOOLEAN:{
                value = args.value;
                break;
            }
            case SPROTO_TSTRING:{
                var arr = new Array();
                for (var i=0; i<args.length; i++){
                    arr.push(args.value[i]);
                }
                value = utf82string(arr);
                break;
            }
            case SPROTO_TSTRUCT:{
                var sub = new Object();
                var r;
                sub.deep = self.deep + 1;
                sub.array_index = 0;
                sub.array_tag = null;
                sub.result = new Object();
                if (args.mainindex >= 0){
                    sub.mainindex_tag = args.mainindex;
                    r = sproto_decode(args.subtype, args.value, args.length, decode, sub);
                    if (r < 0 || r != args.length){
                        return r;
                    }
                    value = sub.result;
                    break;
                } else {
                    sub.mainindex_tag = -1;
                    sub.key_index = 0;
                    r = sproto_decode(args.subtype, args.value, args.length, decode, sub);
                    if (r < 0){
                        return SPROTO_CB_ERROR;
                    }
                    if (r != args.length)
                        return r;
                    value = sub.result;
                    break;
                }
            }
            default:
                alert("Invalid type");
            }
            if (args.index > 0){
                self.result[args.tagname][args.index-1] = value;
            } else {
                self.result[args.tagname] = value;
            }
            return 0;
        }

        sp.objlen = function(type, inbuf){
            var st = sproto_type(sp, type);
            if (st == null){
                return null; // response nil
            }
            var ud = new Object();
            ud.array_tag = null;
            ud.deep = 0;
            ud.result = new Object();
            return sproto_decode(st, inbuf, inbuf.length, decode, ud);
        }

        sp.encode = function(type, indata){
            
            var st = sproto_type(sp, type);
            if (st == null){
                return null; // response nil
            }
            var self = new Object();
            var tbl_index = 2;
            var enbuffer = new Array();
            var buffer_idx = 0;
            self.st = st;
            self.tbl_index = tbl_index;
            self.indata = indata;
            for (;;){
                self.array_tag = null;
                self.array_index = 0;
                self.deep = 0;
                self.iter_index = tbl_index + 1;
                var r = sproto_encode(st, enbuffer, buffer_idx, encode, self);
                if (r < 0){
                    return null;
                } else {
                    return enbuffer;
                }
            }
        }

        sp.encode_st = function(st, indata){
            var self = new Object();
            var tbl_index = 2;
            var enbuffer = new Array();
            var buffer_idx = 0;
            self.st = st;
            self.tbl_index = tbl_index;
            self.indata = indata;
            for (;;){
                self.array_tag = null;
                self.array_index = 0;
                self.deep = 0;
                self.iter_index = tbl_index + 1;
                var r = sproto_encode(st, enbuffer, buffer_idx, encode, self);
                if (r < 0){
                    return null;
                } else {
                    return enbuffer;
                }
            }
        }

        sp.decode = function(type, inbuf){
            var st = sproto_type(sp, type);
            if (st == null){
                return null;
            }
            var buffer = inbuf;
            var sz = inbuf.length;
            var ud = new Object();
            ud.array_tag = null;
            ud.deep = 0;
            ud.result = new Object();
            var r = sproto_decode(st, buffer, sz, decode, ud);
            if (r < 0){
                alert("decode error");
                return null;
            }

            return ud.result;
        }

        sp.decode_st = function(st, inbuf){
             var buffer = inbuf;
            var sz = inbuf.length;
            var ud = new Object();
            ud.array_tag = null;
            ud.deep = 0;
            ud.result = new Object();
            var r = sproto_decode(st, buffer, sz, decode, ud);
            if (r < 0){
                alert("decode error");
                return null;
            }

            return [r, ud.result];
        }

        sp.pack = function(inbuf){
            return Sproto.pack(inbuf);
        }

        sp.unpack = function(inbuf){
            return Sproto.unpack(inbuf);
        }

        sp.pencode = function(type, inbuf){
            var obuf = sp.encode(type, inbuf);
            if (obuf == null) {
                return null;
            }
            return Sproto.pack(obuf);
        }
        sp.pdecode = function(bype, inbuf){
            var obuf = sp.unpack(inbuf);
            if (obuf == null) {
                return null;
            }
            return Sproto.decode(type, obuf);
        }

        sp.host = function(packagename){
            packagename = packagename ? null : "package"
            var st = sproto_type(sp, packagename);
            if (st == null){
                return null;
            }
            sp.__package = st;
        }

        sp.attach = function(sp2){
            sp.__session = __session;
            sp.attach_sp = sp2;
            return function(name, args, session) {
                var req_proto = sproto_proto(sp2, name);
                if(req_proto == null) {
                    
                    return null;
                }
                var tag = req_proto.tag;
                header_tmp.type = tag;
                header_tmp.session = session;

                if (session != null) {
                    //__session[session] = req_proto.p[1] ? req_proto.p[1] : true;
                    __session[session] = req_proto;
                }


                var header = sp.encode_st(sp.__package, header_tmp);

                if(args != null){
                    var content = sp2.encode_st(req_proto.p[0], args);
                    header.push.apply(header, content);
                    return Sproto.pack(header);
                }
                else {
                    return Sproto.pack(header);
                }
            }
        }

        sp.dispatch = function(buf) {
            var bin = Sproto.unpack(buf);
            header_tmp.type = null;
            header_tmp.session = null;
            var rets = sp.decode_st(sp.__package, bin);
            var header = rets[1];
            var len = rets[0];
            var content = bin.slice(len);
            if (header.type != null) {
                //request
                var req_proto = query_proto(sp, header.type);
                var req_result = sp.decode_st(req_proto.p[0], content);

                return ["REQUEST", req_proto.name, req_result[1]];

            }else{
                //response
                var req_proto = sp.__session[header.session];
                if(req_proto == null) {
                    console.error("req_proto is null session = " + header.session);
                }

                if(req_proto.p[1] == null) {
                    return ["RESPONSE", req_proto.name, {}];
                }

                var rep_result = sp.attach_sp.decode_st(req_proto.p[1], content);
                return ["RESPONSE", req_proto.name, rep_result[1]];
                
            }
        }

        sp.queryproto = function(name) {
            return sproto_type(sp, name);
        }

        return sp;
    },

    
};

module.exports = Sproto;