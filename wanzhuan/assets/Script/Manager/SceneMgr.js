/**
 * 场景管理
 */

 var SceneMgr = function() {
    //场景的根节点， 挂接加载的场景(一直存在场景中， 不会销毁)
    this.scene_root = null;

     //当前加载的场景节点 
    this._cur_scene_node = null;
    //todo:是否有需要同时显示多个场景的需求， 目前来看没有.
 }  
 var sceneMgr = new SceneMgr();
 var _this = sceneMgr;

 var prototype = SceneMgr.prototype;

 prototype.setSceneRoot = function(root) {
     this.scene_root = root;
 }

 prototype.loadScene = function(mapID, onCallBack) {
    var mapConfigItem = cc.configMgr.getGuaJiNodeItem(mapID);
    if(mapConfigItem == null) {
        cc.error("SceneMgr loadScene mapConfigItem is null mapID = ", mapID);
        onCallBack();
        return;
    }
    var res_path = mapConfigItem.res_path;
    if(res_path == null) {
        cc.error("SceneMgr loadScene res_path is null mapID = ", mapID);
        onCallBack();
        return;
    }
    cc.resMgr.instancePrefab(res_path, function(err, sceneNode) {
        if(err != null) {
            cc.error("SceneMgr loadScene error res_path = ", res_path);
            onCallBack();
            return;
        }
        sceneNode.parent = _this.scene_root;
        sceneNode.setPosition(0, 0);

        //释放到之前的场景
        if(_this._cur_scene_node != null) {
            _this._cur_scene_node.destroy();
        }
        cc.backgroundCtrl = sceneNode.getComponent(cc.BackgroundControl);
        _this._cur_scene_node = sceneNode;
        if(onCallBack != null) {
            onCallBack(sceneNode);
        }
    });
 }

 /**
  * 退出当前场景
  */
 prototype.exitScene = function() {
    //cc.GameWorldCommand.ON_KICK_SCENE
    if(_this._cur_scene_node != null) {
        _this._cur_scene_node.destroy();
    }
 }




 cc.sceneMgr = sceneMgr;
