/**
 * 配置表管理
 */

var ConfigMgr = function () {
    //配置表的数组
    this.configMap = [];
    //场景地图的map
    this.sceneDataMap = {};
}

var configMgr = new ConfigMgr();
var _this = configMgr;

var prototype = ConfigMgr.prototype;

//配置名称对应索引 名称必须唯一，
//配置名称对应索引 必须唯一
//外部访问 是通过名称访问
//
var ConfigName = {
    longBaseData: {
        key:1,
        res:"config/long_basedata.json",
        fun: parseJsonArray
    },
}

/**
 * 转换成 map类型方法访问
 * @param {*Array} arrayData 
 */
var parseJsonArray = function (arrayData, keyName) {
    var config = {}
    if(keyName == null) {
        keyName = "id";
    }
    for (var i = 0; i < arrayData.length; i++) {
        config[arrayData[i][keyName]] = arrayData[i];
    }
    return config
}

var parseJsonArray2 = function(arrayData, keyName1, keyName2) {
    var config = {}
    for (var i = 0; i < arrayData.length; i++) {
        var cfg_item = arrayData[i];
        var key1 = cfg_item[keyName1];
        var cfg_1 = config[key1];
        if(cfg_1 == null) {
            cfg_1 = {};
            config[key1] = cfg_1;
        }
        cfg_1[cfg_item[keyName2]] = cfg_item;
    }

    return config;
}

var parseJsonArray3 = function(arrayData, keyName1, keyName2, keyName3) {
    var config = {}
    for (var i = 0; i < arrayData.length; i++) {
        var cfg_item = arrayData[i];
        var key1 = cfg_item[keyName1];
        var cfg_1 = config[key1];
        if(cfg_1 == null) {
            cfg_1 = {};
            config[key1] = cfg_1;
        }

        var key2 = cfg_item[keyName2];
        var cfg_2 = cfg_1[key2];
        if(cfg_2 == null) {
            cfg_2 = {};
            cfg_1[key2] = cfg_2;
        }

        var key3 = cfg_item[keyName3];
        cfg_2[key3] = cfg_item;
    }

    return config;
}

var parseNone = function(arrayData) {
    return arrayData;
}

/**
 * 加载所有配置文件
 */
prototype.loadAllConfig = function (onLoadDone) {
    var allConfigPath = [];
    var idxToInfo = {}
    for(var key in ConfigName) {
        var configInfo = ConfigName[key];
        allConfigPath[configInfo.key] = configInfo.res;  
        idxToInfo[configInfo.key] = configInfo;

    }
    cc.resMgr.loadConfigs(allConfigPath, function (err, datas) {
        if (err != null) {
            cc.error(err);
        }
        else {
            for (var i = 0; i < allConfigPath.length; i++) {
                var configInfo = idxToInfo[i] 
                //加载完成的json配置默认就已经转换成js对象了
                var parseFun = configInfo.fun;
                if(parseFun == null) {
                    parseFun = parseJsonArray;
                }
                var config = parseFun(datas[i].json);
                _this.configMap[configInfo.key] = config;
            }

        }

        if (onLoadDone != null) {
            onLoadDone();
        }
    });
}



prototype.getConfig = function(configIdx) {
    return _this.configMap[configIdx];
}

var cfg_Name ={
    longBaseData:0,
    longtujianData:1,
    item_data:2,
    longUpOut_data:3,
    vip_data:4,
    friend_data:5,
    market_data:6,
}

ConfigName = {
    longBaseData: {
        key:0,
        res:"config/long_basedata",
        fun: parseJsonArray
    },

    longtujianData: {
        key:1,
        res:"config/long_tujiandata",
        fun: parseJsonArray
    },
    item_data: {
        key:2,
        res:"config/item_data",
        fun: parseJsonArray
    },
    longUpOut_data: {
        key:3,
        res:"config/longUpOut_data",
        fun: parseJsonArray
    },
    vip_data: {
        key:4,
        res:"config/vip_data",
        fun: parseJsonArray
    },
    friend_data: {
        key:5,
        res:"config/friend_data",
        fun: parseJsonArray
    },
    market_data:{
        key:6,
        res:"config/market_data",
        fun: parseJsonArray
    }
}

//根据id获取龙的基本信息
prototype.getLongBaseDataById = function(lid){
    var longData = null;
    var list = cc.configMgr.configMap[cc.cfg_Name.longBaseData];
    for (const key in list) {
        if (list.hasOwnProperty(key)) {
            const element = list[key];
            if (Number(element.id) == Number(lid)  ) {
            longData = element;
            }
        }
    }
    return longData;
  }

  //根据id获取龙的基本信息
prototype.getLongBaseDataByStep = function(level){
    var longData = null;
    var list = cc.configMgr.configMap[cc.cfg_Name.longBaseData];
    for (const key in list) {
        if (list.hasOwnProperty(key)) {
            const element = list[key];
            if (Number(element.step) == Number(level)  ) {
            longData = element;
            }
        }
    }
    return longData;
  }


  prototype.getLongTuJianDataById = function(lid){
    var longData = null;
    var list = cc.configMgr.configMap[cc.cfg_Name.longtujianData];
    for (const key in list) {
        if (list.hasOwnProperty(key)) {
            const element = list[key];
            if (Number(element.id) == Number(lid)  ) {
               longData = element;
            }
        }
    }
    return longData;
  }

  //根据id和等级获取龙产出和升级需要的东西
  prototype.getLongUpOutItemData = function(longid,lv){
    var data = null;
    var list = cc.configMgr.configMap[cc.cfg_Name.longUpOut_data];
    for (const key in list) {
        if (list.hasOwnProperty(key)) {
            const element = list[key];
            if (Number(element.longid) == Number(longid)) {
                if ( Number(lv) == Number(element.level)) {
                    data = element;     
                    break;
                }
            }
        }
    }
    return data;
  }


  
  //根据itemid获取item信息
  prototype.getItemDataById = function(itemid){
    var data = null;
    var list = cc.configMgr.configMap[cc.cfg_Name.item_data];
    for (const key in list) {
        if (list.hasOwnProperty(key)) {
            const element = list[key];
            if (Number(element.id) == Number(itemid) ) {
                data = element;
                break;
            }
        }
    }
    return data;
  }

  //好友助力表的
  prototype.getFriendDataByStep = function(step){
    var data = null;
    var list = cc.configMgr.configMap[cc.cfg_Name.friend_data];
   
    for (const key in list) {
        if (list.hasOwnProperty(key)) {
            const element = list[key];
            if (Number(element.id) == Number(step) ) {
                data = element;
                break;
            }
        }
    }
    return data;
  }

 //好友助力表的
 prototype.getmarketDataByLv = function(marketlv){
    var data = null;
    var list = cc.configMgr.configMap[cc.cfg_Name.market_data];
   
    for (const key in list) {
        if (list.hasOwnProperty(key)) {
            const element = list[key];
            if (Number(element.marketLv) == Number(marketlv) ) {
                data = element;
                break;
            }
        }
    }
    return data;
  }


cc.configMgr = configMgr;
cc.cfg_Name = cfg_Name;


