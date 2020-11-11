//资源管理

var readUint8Array = function (blob, callback, onerror) {
    var reader = new FileReader();
    reader.onload = function (e) {
        callback(new Uint8Array(e.target.result));
    };
    reader.onerror = onerror;
    try {
        reader.readAsArrayBuffer(blob);
    } catch (e) {
        onerror(e);
    }
}


var onLoadProto = function (bomb, onload) {
    readUint8Array(bomb, function (unit8Arr) {
        //testSproto(unit8Arr);
        if(onload){
            onload(unit8Arr);
        }
    });
}

var protoLoadFun = function (filePath, onLoaded) {
    var oReq = cc.loader.getXMLHttpRequest();
    oReq.open("GET", filePath, true);
    //oReq.overrideMimeType('text/plain; charset=x-user-defined');
    oReq.responseType = "blob";
    //oReq.responseType = "arraybuffer";
    oReq.onload = function (oEvent) {
        //onLoadProto(oReq.response);
        onLoaded(oReq.err, oReq.response);
    };
    //oReq.onerror = ... //todo错误处理。
    oReq.send();
}

var RegisterProtoLoader = function () {
    cc.loader.addDownloadHandlers({
        "sproto": function (item, callback) {
            var filePath = item.url;
            protoLoadFun(filePath, callback);
        }
    });
}

//cc.loader.addDownloadHandlers({ bin: cc.loader.downloader["extMap"].binary });
cc.loader.addLoadHandlers({
    sproto: function (item, callback) {
    item._owner.rawBuffer = item.content;
    return item.content;
    }
    })
/** 
 * 加载信息Proto
* @class LoadingInfo
* @
*/
var LoadingBlobInfo = function(blobs, onComplete) {
    this.blobs = blobs;
    this.onComplete = onComplete;
    //已经加载的数量
    this.completedCount = 0;
    this.totalCount = blobs.length;
    this.loadedArr = [];
};

var loadProtoBuff = function(info, blob, index) {
    var reader = new FileReader();

    var _$this = info;
    reader.onload = function (e) {
        _$this._onLoaded(new Uint8Array(e.target.result), index);
    };
    reader.onerror = function(e) {
        _$this._onLoadErr(e);
    };
    try {
        reader.readAsArrayBuffer(blob.rawBuffer);
    } catch (e) {
        info._onLoadErr(e);
    }
}

LoadingBlobInfo.prototype.startLoad = function() {
    for (var i = 0; i < this.blobs.length; ++i) {
        var blob = this.blobs[i];
        loadProtoBuff(this, blob, i);
        //readUint8Array(this.blobs[i], this._onLoaded, this._onLoadErr);
    }       
};

LoadingBlobInfo.prototype._onLoaded = function(unit8Arr, index) {
    this.completedCount++;
    this.loadedArr[index] = unit8Arr;

    if(this.completedCount >= this.totalCount) {
        if(this.onComplete != null) {
            this.onComplete(this.loadedArr);
        }
    }
};

LoadingBlobInfo.prototype._onLoadErr = function(err) {
    console.log(err);
};

//todo:可以考虑做缓存
LoadingBlobInfo.create = function(blobs, onComplete) {
        //todo:做错误类型检查
        var info = new LoadingBlobInfo(blobs, onComplete);
        return info;
};

/**
 * 资源管理类，暂值做了简单的封装， 总resources目录下加载资。
 * TODO:后期需要考虑资源的下载和管理，避免过多垃圾资源存在。
 */
var ResMg = function(){
    this.cacheSpriteFrames = {};
};

var proto = ResMg.prototype;
 /**
 * !#en load sproto
 * !#zh 加载sproot协议文件
 * @method LoadProto
 * @param {String} url ["proto/c2s", "proto/s2c"]
 */
proto.loadProtos = function(urls, onLoaded) {
    cc.loader.loadResArray(urls,  function (err, buffers) {

        var info = LoadingBlobInfo.create(buffers, function(unit8Arrs) {
            onLoaded(unit8Arrs);
        });

        info.startLoad();
    });
};

/**
 * 加载预制体
 * @param urls urls
 * @param onLoaded 加载完成回调
 * @example loadPrefabs(["game/test1", "game/test2"], function(prefabs) {
 *      
 * })
 */
proto.loadPrefabs = function(urls, onLoaded) {
    cc.loader.loadResArray(urls,  function (err, prefabs) {
        onLoaded(prefabs);
    });
};

/**
 * 加载并实例化一个预制体
 * @param url 路径
 * @param onCallBack 实例完成后回调 参数为实例化的对象
 * @example instancePrefab("/login/login_panel" function(err, iPrefab) {
 *      iPrefab.parent = this.node;
 *      iPrefab.setPosition(-210, 100);
 *  })
 */
proto.instancePrefab = function(url, onCallBack) {
    cc.loader.loadResArray([url],  function (err, prefab) {
        if(err != null) {
            cc.error(err);
            onCallBack(err);
            return;
        }
        var instancePrefab = cc.instantiate(prefab[0]);
        onCallBack(err, instancePrefab);
    });
};

/**
 * 加载配置表
 */
proto.loadConfigs = function(urls, onLoaded) {
    cc.loader.loadResArray(urls,  function (err, configs) {
        onLoaded(err, configs)
    });
}

proto.loadAtals = function(urls, onLoaded) {
    cc.loader.loadResArray(urls, cc.SpriteAtlas, function(err, assets) {
        if(err != null) {
            cc.error("ResMgr loadAtals error ", err);
            return;
        }
        onLoaded(err, assets);
    });
}

proto.loadSpriteFrames = function(urls, onLoaded) {
    cc.loader.loadResArray(urls, cc.SpriteFrame, function(err, assets) {
        if(err != null) {
            cc.error("ResMgr loadSpriteFrames error ", err);
            return;
        }
        onLoaded(err, assets);
    });
}

proto.loadSpriteFrame = function(url, onLoaded, target) {
    var cacheSpriteFrame = this.cacheSpriteFrames[url];
    if(cacheSpriteFrame != null) {
        onLoaded(null, cacheSpriteFrame, target);
        return;
    }
    var _this = this;
    cc.loader.loadRes(url, cc.SpriteFrame, function(err, asset) {
        if(err != null) {
            cc.error("ResMgr loadSpriteFrame error ", err);
            return;
        }
        _this.cacheSpriteFrames[url] = asset;
        if(target != null) {
            onLoaded(err, asset, target);
        }
    });
}

/**
 * 加载非resources目录下的资源 todo暂时没有用
 */
proto.loadAssets = function(urls, onLoaded) {
    cc.loader.load(urls, function(err, assets) {
        if(err != null) {
            cc.error("ResMgr loadAssets error ", err);
            return;
        }
        onLoaded(err, assets);
    });
}

//TODO: cc.loader.releaseAsset
RegisterProtoLoader();

var resMgr = new ResMg();
cc.resMgr = resMgr;

/**
 * @module cc
 */

/**
 * @property resMgr
 * @type ResMgr
 */
 module.exports = resMgr;
