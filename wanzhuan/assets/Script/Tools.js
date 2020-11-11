
var et =  {
    reviewingVersion:'0.0.0',
    reviewing:false,
    counter:undefined,

    getVersion() {
        if (cc.sys.os == cc.sys.OS_IOS) {
            var appVersion = jsb.reflection.callStaticMethod('IosHelper', "appVersion");
            var buildVersion = jsb.reflection.callStaticMethod('IosHelper', "buildVersion");
            return appVersion + '_' + buildVersion;
        }
        else if (cc.sys.os == cc.sys.OS_ANDROID) {
            var appVersion = jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'getVersion', '()Ljava/lang/String;');
            return appVersion;
        } else {
            return '2.4.0';
        }
    }
}


cc.et = et 