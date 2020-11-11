/**
 * 一些公用方法的封装
 */



var onFlyMsgFinish = function(node, flyInfo) {
    flyInfo.nodeCaches.push(flyInfo);
    flyInfo.node.active = false;
}

var exeFlyAction = function(action, flyInfo) {
    //添加到运行的列表
    var node = flyInfo.node;
    node.active = true;
    

    //加上最后完成的动画
    var finish = cc.callFunc(onFlyMsgFinish, node, flyInfo);
    var seq = cc.sequence(action, finish);

    node.runAction(seq);
}



var Util = {
    parsePosFromStr: function(pos_str) {
        var pos_str_arr = pos_str.split(";");
        var pos = cc.v2(parseFloat(pos_str_arr[0]) ,parseFloat(pos_str_arr[1]));
        return pos;
    },

    /**
     * 将字符串解析成int 数组
     * del 分隔符
     */
    parseStrIntArr: function(str, del) {
        var strs = str.split(del);
        for(var i = 0; i < strs.length; i++) {
            strs[i] = parseInt(strs[i]);
        }

        return strs;
    },
    
    /**
     * 获取多个SpriteFrame
     */
    getSpriteFrames: function (atlas, name_prefix, startIdx, endIdx, formatIdxFun) {
        var frames = [];
        for(var i = startIdx; i <= endIdx; i++) {
            if(formatIdxFun != null) {
                var spriteFrame = atlas.getSpriteFrame(name_prefix + formatIdxFun(i));
                frames.push(spriteFrame);
            }else {
                var spriteFrame = atlas.getSpriteFrame(name_prefix + i);
                frames.push(spriteFrame);
            }
            
        }
        
        return frames;
    },
    //cc.WrapMode.Loop
    playAnim: function(anim, atlas, name, prefix, start_idx, end_idx, wrapMode, samp, formatIdxFun) {
        var state = anim.getAnimationState(name);
        if(prefix == null) {
            prefix = "";
        }
        if(wrapMode == null) {
            wrapMode = cc.WrapMode.Loop
        }
        if(state == null) {
            var spriteFrames = this.getSpriteFrames(atlas, prefix, start_idx, end_idx, formatIdxFun);
            var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, samp);
            clip.wrapMode = wrapMode;
            anim.addClip(clip, name);
        } else {
            state.clip.wrapMode = wrapMode;
        }
        
        anim.play(name, 0);
        //this.clothesSprite
    },


  

 

    //插入排序
    insertionSort: function(sort_array, cmpFun) {
        var len = sort_array.length, i, j, child;
        for (i = 1; i < len; i++) {
            child = sort_array[i];
            j = i - 1;

            //continue moving element downwards while zOrder is smaller or when zOrder is the same but mutatedIndex is smaller
            while (j >= 0) {
                if(cmpFun(child, sort_array[j])) {
                    sort_array[j + 1] = sort_array[j];
                }else {
                    break;
                }
                j--;
            }
            sort_array[j + 1] = child;
        }
    },

    loadSpriteFrameAnim: function(pathDir, prefix, num, isAddZero, onLoadCB) {
        var res_urls = [];
        if(isAddZero == true) {
            res_urls.push(pathDir + prefix);
        }
        if(num > 0) {
            //res_urls.push(pathDir + prefix)
            for(var i = 1; i <= num;i ++) {
                res_urls.push(pathDir + prefix + "_" + i);
            }
        }
        cc.resMgr.loadSpriteFrames(res_urls, function(err, spriteFrames) {
            var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 1.5);
            clip.wrapMode = cc.WrapMode.Loop;
            //anim.addClip(clip, name);
            onLoadCB(clip);
        });
    },

    loadSpriteFrame: function(path, sprite) {
        cc.resMgr.loadSpriteFrame(path, function(err, spriteFrame, target) {
            target.spriteFrame = spriteFrame;
        }, sprite);
    },

    toBlodString: function(str) {
        return "<b>" + str + "</b>";
    },

    format2Num: function(num){
        if(num >= 10) {
            return "" + num;
        }else {
            return "0" + num;
        }
    },

    timeToStr: function(sec) {
        var s = sec % 60;
        sec -= s;
        var min = parseInt(sec / 60);
        var h = parseInt(min / 60);
        min = min % 60;

        if(h > 0) {
            return Util.format2Num(h) + ":" + Util.format2Num(min) + ":" + Util.format2Num(s);
        }else if(min > 0) {
            return Util.format2Num(min) + ":" + Util.format2Num(s);
        }else {
            return "00:" + Util.format2Num(s);
        }

    },

    //date = '2015-03-05 17:59:00.0';
    getTimeStampByStr: function(date) {
        if(date == null) {
            return 0;
        }
        date = date.substring(0,19);    
        date = date.replace(/-/g,'/'); 
        var timestamp = new Date(date).getTime();

        return timestamp;
    },

    //timestamp = '1425553097';
    timeStampToStr: function(timestamp) {
        var d = new Date(timestamp * 1000);    //根据时间戳生成的时间对象
        var date = (d.getFullYear()) + "-" + 
                (d.getMonth() + 1) + "-" +
                (d.getDate()) + " " + 
                (d.getHours()) + ":" + 
                (d.getMinutes()) + ":" + 
                (d.getSeconds());
        return date;
    },

    timeToStr2: function(time, noday) {
        var day = Math.floor(time / 3600 / 24);
        var hours = Math.floor((time % (3600 * 24) / 3600));
        var minutes = Math.floor((time % 3600) / 60);
        var seconds = Math.floor(time % 60);
        var timeStr = "";
        if (noday && day == 0)
            timeStr = hours + "时" + minutes + "分" + seconds + "秒";
        else
            timeStr = day + "天" + hours + "时" + minutes + "分" + seconds + "秒";
        return timeStr;
    },

    setItemSprite: function(spriteName, sprite) {
        cc.atlasMgr.loadItemSpriteFrame(spriteName, null, sprite);
    },

    setSkillSprite: function(spriteName, sprite) {
        cc.atlasMgr.loadSkillSpriteFrame(spriteName, null, sprite);
    },

    setEquipSprite: function(spriteName, sprite) {
        cc.atlasMgr.loadEquipSpriteFrame(spriteName, null, sprite);
    },

    setGemSprite: function(spriteName, sprite) {
        cc.atlasMgr.loadGemSpriteFrame(spriteName, null, sprite);
    },

    setShengWenSprite: function(spriteName, sprite) {
        cc.atlasMgr.loadShengWenSpriteFrame(spriteName, null, sprite);
    },

    setSpriteByAtlas: function(spriteName, sprite, atlas) {
        var spriteFrame = atlas.getSpriteFrame(spriteName);
        sprite.spriteFrame = spriteFrame;
    },
    getCurTimeStamp: function() {
        var timestamp = (new Date()).getTime();
        return timestamp / 1000;
    }

}

cc.Util = Util;
module.exports = Util;
