//音频管理

var AudioMgr = function(){
    //当前播放的背景音乐
    this.bgmAudio = null;
    this.bgmVolume = 1.0;
    this.sfxVolume = 1.0;
    this.bgmAudioID = -1;

    var t = cc.sys.localStorage.getItem("bgmVolume");
    if(t != null){
        this.bgmVolume = parseFloat(t);    
    }
    
    var t = cc.sys.localStorage.getItem("sfxVolume");
    if(t != null){
        this.sfxVolume = parseFloat(t);    
    }
    
    cc.game.on(cc.game.EVENT_HIDE, function () {
        console.log("cc.audioEngine.pauseAll");
        cc.audioEngine.pauseAll();
    });
    cc.game.on(cc.game.EVENT_SHOW, function () {
        console.log("cc.audioEngine.resumeAll");
        cc.audioEngine.resumeAll();
    });

};

var prototype = AudioMgr.prototype;

var getUrl = function(url){
    return cc.url.raw("resources/sounds/" + url);
};

/**
 * 播放背景音乐，背景音乐一次只能存在一个
 */
prototype.playBgm = function(url) {
    var audioUrl = this.getUrl(url);
    if(this.bgmAudioID >= 0) {
        this.stopBgm();
    }
    var audioID = cc.audioEngine.play(audioUrl, true, this.bgmVolume);
    this.bgmAudioID  = audioID
    return audioID;
};

prototype.pauseBgm = function() {
    if(this.bgmAudioID >= 0) {
        cc.audioEngine.pause(this.bgmAudioID);
        this.bgmAudioID = -1;
    }else {
        cc.error("AudioMgr pauseBgm bgmAudioID is less 0");
    }
}

/**
 * 停止背景音乐播放
 */
prototype.stopBgm = function() {
    if(this.bgmAudio != null) {
        cc.audioEngine.stop(this.bgmAudio);
        
        //todo:做资源释放?
        this.bgmAudio = null;
    }
};


prototype.playSFX = function(url){
    var audioUrl = this.getUrl(url);
    if(this.sfxVolume > 0){
        var audioId = cc.audioEngine.play(audioUrl,false,this.sfxVolume);    
    }
},

prototype.setSFXVolume = function(v){
    if(this.sfxVolume != v){
        cc.sys.localStorage.setItem("sfxVolume",v);
        this.sfxVolume = v;
    }
},

prototype.setBGMVolume = function(v,force){
    if(this.bgmAudioID >= 0){
        if(v > 0){
            cc.audioEngine.resume(this.bgmAudioID);
        }
        else{
            cc.audioEngine.pause(this.bgmAudioID);
        }
        //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
    }
    if(this.bgmVolume != v || force){
        cc.sys.localStorage.setItem("bgmVolume",v);
        this.bgmVolume = v;
        cc.audioEngine.setVolume(this.bgmAudioID,v);
    }
},

prototype.pauseAll = function(){
    cc.audioEngine.pauseAll();
},

prototype.resumeAll = function(){
    cc.audioEngine.resumeAll();
}

var audioMgr = new AudioMgr();

cc.audioMgr = audioMgr;
module.exports = audioMgr;
