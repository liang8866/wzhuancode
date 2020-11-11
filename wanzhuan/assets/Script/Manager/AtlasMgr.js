/**
 * 图集资源管理
 */

 var _this;
var AtlasMgr = function(){
    //所有已经加载的图集 name -> atlas
    this.allLoadedAtlas = {}
    _this = this;
  };
    
 var prototype = AtlasMgr.prototype;
 var atlasMgr = new AtlasMgr()

 //所有需要预加载的图集 name -> path
var allPreLoadPaths = {
    longicon:"atlas/longicon",
    items_icon:"atlas/items_icon",
  
};

prototype.loadAllPre = function(onLoadCB) {
    var _this = this;
    var preLoadArr = [];
    var index2Name = [];
    var index = 0
    for(var k in allPreLoadPaths) {
        preLoadArr[index] = allPreLoadPaths[k];
        index2Name[index] = k;
        index++;
    }
    cc.resMgr.loadAtals(preLoadArr, function(err, spriteAtlasArr) {
        if(err != null) {
            cc.error("AtlasMgr loadAllPre is error ", err);
        }else {
            for(var i = 0; i < spriteAtlasArr.length; i++) {
                _this.allLoadedAtlas[index2Name[i]] = spriteAtlasArr[i];
            }
        }
        onLoadCB(spriteAtlasArr)
    });
}

/**
 * 通过道具配置表里面配置的pic_name字段获取对应的SpriteFrame
 * 
 */
prototype.getSpriteFrame = function(spriteName) {
    //之后会有个工具根据图片名称 -> 图集名称的映射
    var atlasName = cc.configMgr.getAtlasName(spriteName + "");
    if(atlasName == null) {
        cc.error("AtlasMgr getSpriteFrame atlasName is null spriteName = ", spriteName);
        return;
    }
    var atlas = this.allLoadedAtlas[atlasName];
    if(atlas != null) {
        var frame = atlas.getSpriteFrame(spriteName);
        if(frame == null) {
            cc.error("AtlasMgr getSpriteFrame spriteName = ", spriteName);
            return atlas.getSpriteFrame("icon_test");
        }
        return frame;
    }else {
        cc.error("AtlasMgr getSpriteFrame atlas is nil spriteName = ", spriteName);
    }
    
}

var loadAtlasFunc = function(atlasName, atlasPath, onLoadedCB) {
    cc.resMgr.loadAtals([atlasPath], function(err, spriteAtlasArr) {
        if(err != null) {
            cc.error("AtlasMgr loadAtlasFunc is error ", err);
        }else {
            _this.allLoadedAtlas[atlasName] = spriteAtlasArr[0];
        }
        onLoadedCB(err, spriteAtlasArr[0]);
    });
}

var loadSpriteFrame = function(spriteName, atlasName, atlasPath, onLoadedCB, targetSprite){
    var atlas = _this.allLoadedAtlas[atlasName];

    if(atlas == null) {
        loadAtlasFunc(atlasName, atlasPath, function(err, spriteAtlas) {
           
            var frame = spriteAtlas.getSpriteFrame(spriteName);
            if(frame == null) {
                return null;
                cc.error("AtlasMgr loadSpriteFrame spriteName = ", spriteName);
            }else {
                if(targetSprite != null) {
                    targetSprite.spriteFrame = frame;
                }
            }

            if(onLoadedCB != null) {
                onLoadedCB(frame);
            }
            
        });
    } else {
        var frame = atlas.getSpriteFrame(spriteName);
            if(frame == null) {
                return null;
                cc.error("AtlasMgr loadSpriteFrame spriteName = ", spriteName);
            }else {
                if(targetSprite != null) {
                    targetSprite.spriteFrame = frame;
                }
            }
            if(onLoadedCB != null) {
                onLoadedCB(frame);
            }
    }
    return 0;
}


prototype.loadLongIconSpriteFrame = function(spriteName, onLoadedCB, targetSprite) {
    var str = spriteName.split(".");
    var sname = str[0];
    loadSpriteFrame(sname, "longicon", "atlas/longicon", onLoadedCB, targetSprite);
}

prototype.loadItemSpriteFrame = function(spriteName, onLoadedCB, targetSprite) {
    var str = spriteName.split(".");
    var sname = str[0];
    var ret = loadSpriteFrame(sname, "items_icon", "atlas/items_icon", onLoadedCB, targetSprite);
    if (ret == null) {
         cc.error("AtlasMgr loadSpriteFrame spriteName = ", sname);
     
    }
}

// prototype.loadSkillSpriteFrame = function(spriteName, onLoadedCB, targetSprite) {
//     loadSpriteFrame(spriteName, "skill_icons", "atlas/icon/skill_icons", onLoadedCB, targetSprite);
// }





cc.atlasMgr = atlasMgr;