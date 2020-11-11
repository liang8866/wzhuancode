
cc.Class({
    extends: cc.Component,

    properties: {
        panel: cc.Node,
        manifestUrl: {
            default:null,
            type:cc.Asset
        },
        _updating: false,
        _canRetry: false,
        
        progressbar: cc.ProgressBar,
        info: cc.Label,
        version: cc.Label,

        _delegate: null,

    },

    checkCb: function (event) {
        cc.log('checkCb.Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
               // this.info.string = "No local manifest file found, hot update skipped.";
                cc.log("No local manifest file found, hot update skipped.")
                this._delegate.onUpdateFinished();
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                //this.info.string = "Fail to download manifest file, hot update skipped.";
                cc.log("Fail to download manifest file, hot update skipped.")
                // ui.alert({
                //     content: '检查更新失败，请检查网络！',
                //     confirmText: '退出',
                //     cancelText: '重连',
                //     onOK: () => {
                //         cc.game.end();
                //     },
                //     onCancel: () => {
                //         cc.game.restart();
                //     }
                // })
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.info.string = "已更新到新版本！";
                cc.log("checkCb 已更新到新版本！")
                this.progressbar.progress = 1;
                this._delegate.onUpdateFinished();
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.info.string = '检测到新内容，开始更新。';
                cc.log("checkCb 检测到新内容，开始更新。")
                //cc.startScene.hotNode.x = 0;
                cc.startScene.progressNode.active = true
                // this.panel.fileProgress.progress = 0;
                // this.panel.byteProgress.progress = 0;
                this.progressbar.progress = 0;
                //检测到更新，自动开始更新
                this._updating = false;
                this.hotUpdate();
                break;
            default:
                return;
        }

        // this._am.setEventCallback(null);
        this._checkListener = null;
        this._updating = false;
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.info.string = 'No local manifest file found, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                // this.panel.byteProgress.progress = event.getPercent() / 100;
                // this.panel.fileProgress.progress = event.getPercentByFile() / 100;
                this.progressbar.progress = event.getPercent();

                var msg = event.getMessage();
                let percent = event.getPercent();
                if (isNaN(percent)) {
                    percent = 0
                }
                    let prog = '正在更新...  '+Math.floor(percent*100) + '%'
                    this.info.string = prog;
                console.log(prog + msg);
                console.log('===>>> ',percent)
                //}
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.info.string = '下载 manifest 文件失败, code:'+event.getEventCode();
                console.log('下载 manifest 文件失败, code:'+event.getEventCode())
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.info.string = '已更新到新版本！';
                console.log('updateCb 已更新到新版本！')
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.info.string = '更新完成' + event.getMessage();
                console.log('Update finished. ' + event.getMessage())
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                // failed = true;
                this.info.string = '更新失败 ' + event.getMessage();
                console.log('更新失败' + event.getMessage())
                //this.panel.retryBtn.active = true;
                this._updating = false;
                this._canRetry = true;
                cc.game.restart();
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.info.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage())
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.info.string = event.getMessage();
                console.log(event.getMessage())
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);

            this._updating = false;

            let self = this;
            if (this._canRetry) {
                // ui.alert({
                //     content: '更新失败,请点击 重连 ！',
                //     confirmText: '退出',
                //     cancelText: '重试',
                //     onOK: () => {
                //         cc.game.restart();
                //     },
                //     onCancel: () => {
                //         self.retry();
                //     }
                // })
            }
        }

        console.log('-->needRestart:' + needRestart)
        if (needRestart) {
            this._am.setEventCallback(null);

            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));

            jsb.fileUtils.setSearchPaths(searchPaths);
            cc.game.restart();
        }
    },

    retry: function () {
        if (!this._updating && this._canRetry) {
            //this.panel.retryBtn.active = false;
            this._canRetry = false;

            this.info.string = 'Retry failed Assets...';
            this._am.downloadFailedAssets();
        }
    },

    checkUpdate: function (delegate) {
        if (delegate) {
            this._delegate = delegate;
        }
        cc.log("=====================aaaaaa",this._updating)
        if (this._updating) {
            this.info.string = '检查更新 ...';
            return;
        }
        if (!this._am.getLocalManifest().isLoaded()) {
            cc.log("=====================bbbbbbbbb",this._updating)
            this.info.string = 'Failed to load local manifest ...';
            return;
        }
        this._am.setEventCallback(this.checkCb.bind(this));

        this._am.checkUpdate();
        this._updating = true;
    },

    hotUpdate: function () {
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb.bind(this));

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                var url = this.manifestUrl.nativeUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                console.log('manifest url:',url)
                this._am.loadLocalManifest(url);
            }

            this._failCount = 0;
            this._am.update();
            this._updating = true;
        }
    },

    show: function () {

    },

    // use this for initialization
    onLoad: function () {
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            return;
        }

        this.info.string = '';

        var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') +  cc.Config.game);
        cc.log('Storage path for remote asset : ' + storagePath);
        //console.log('Storage path for remote asset : ' + storagePath);

        cc.log('Local manifest URL : ' + this.manifestUrl.nativeUrl);
        this._am = new jsb.AssetsManager(this.manifestUrl.nativeUrl, storagePath);
    

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this._am.setVersionCompareHandle(function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        });

        var info = this.info;
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                //info.string = "Verification passed : " + relativePath;
                return true;
            }
            else {
                //info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                return true;
            }
        });

        cc.log('Hot update is ready, please check or directly update.');
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);
            //this.info.string = "Max concurrent tasks count have been limited to 2";
        }

        // this.panel.fileProgress.progress = 0;
        // this.panel.byteProgress.progress = 0;
        this.progressbar.progress = 0;

        cc.Config.version = this._am.getLocalManifest().getVersion()
        cc.log("cc.Config.version ===",cc.Config.version)
        this.version.string =  cc.Config.version;

    },

    onDestroy: function () {
        if (this._am) {
            this._am.setEventCallback(null);
        }
 

        // if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
        //     this._am.release();
        // }
    }
});
