var BasePanel = require("../View/BasePanel");

/**
 * UI 管理器， 管理UI的创建， 显示，隐藏等。
 */
var PanelMgr = function() {
    //所有UI界面挂接的根节点
    this.rootNode = null;
    this.nodeLayer = [];
    // viewID -> viewNode
    this.viewMap = {};
    //正在加载中的UI 信息， 可能由于异步的原因，打开了一个View 然后View还没有加载完成 又去关闭
    this.loadingViewMap = {};

  
};
var panelMgr = new PanelMgr();
var _this = panelMgr;
var proto = PanelMgr.prototype;

//用来在同一层的UI 做排序的
var zOrderIndex = 1;

proto.setRootNode = function(rootNode) {
    this.rootNode = rootNode;
    //不同的UI 挂载不同层级的node上 layer1  layer2  layer3
    // this.nodeLayer[0] = rootNode.getChildByName("layer1");
    // this.nodeLayer[1] = rootNode.getChildByName("layer2");
    // this.nodeLayer[2] = rootNode.getChildByName("layer3");
    // this.nodeLayer[3] = rootNode.getChildByName("layer4");
    // this.nodeLayer[4] = rootNode.getChildByName("layer5");
}


/**
 * 加载并显示UI
 * @param viewID 界面的唯一ID， 由具体的逻辑去定义
 * @param resUrl 资源路径，界面预制体的路径
 */
proto.showView = function(viewID, onShow, viweData, parentNode) {
    var _this = this;
    if(_this.viewMap[viewID]) {
        cc.log("PanelMgr showView is showing viewID  = ", viewID);
        //todo  refresh data？
        //zOrderIndex += 1;
        //_this.viewMap[viewID].zIndex = zOrderIndex;
        return;
    }
    if(this.loadingViewMap[viewID] == true) {
        //正在加载中...
        return;
    }
    var resUrl = cc.PanelID2ResPath[viewID];
    if(resUrl == null) {
        cc.error("PanelMgr resUrl is null viewID = ", viewID);
        return;
    }
    this.loadingViewMap[viewID] = true;

    //统一在打开界面的事件加上loading
    // if(cc.loadingPanel != null) {
    //     cc.loadingPanel.show("界面加载中...");
    // }

    cc.resMgr.instancePrefab(resUrl, function(err, viewNode) {
        if(err != null) {
            cc.error("PanelMgr instancePrefab is null resUrl = ", resUrl);
            return;
        }
        if(_this.loadingViewMap[viewID] != true) {
            //在加载过程中删除
            viewNode.destroy();
            return;
        }

        //设置数据要放在.parent 设置父节点前面，设置父节点 会出发onLoad事件
        var basePanel = viewNode.getComponent(cc.BasePanel);
        if(basePanel != null) {
            basePanel.viewData = viweData;
            basePanel.panelID = viewID;
        }
        var layer = cc.PanelID2Layer[viewID];
        
        if(parentNode == null) {
            if(layer == null) {
                cc.error("PanelMgr layer is nil viewID = ", viewID);
                layer = 0;
            }
            
            parentNode = _this.nodeLayer[layer];
        }
        viewNode.parent = parentNode;
        viewNode.setPosition(0, 0);
        _this.viewMap[viewID] = viewNode;
        _this.loadingViewMap[viewID] = null;

       
        if(onShow != null) {
            onShow(basePanel);
        }

        //检查是否还有在加载中的界面
        _this.checkLoadingView();
    });
};

proto.checkLoadingView = function() {
    var has_loading_view = false;
    for(var key in this.loadingViewMap) {
        if(this.loadingViewMap[key]) {
            has_loading_view = true;
            break;
        }
    }
    if(!has_loading_view) {
        if(cc.loadingPanel != null) {
            cc.loadingPanel.hide();
        }
    }
}

proto.hideView = function(viewID) {
    var _this = this;
    var viewNode = _this.viewMap[viewID];
    if(viewNode != null) {
        viewNode.destroy();
        _this.viewMap[viewID] = null;
    }else {
        this.loadingViewMap[viewID] = null;
    }

    //检查是否还有在加载中的界面
    this.checkLoadingView();
};


proto.hideAllView = function() {
    var _this = this;
    var viewNode = _this.viewMap;
    for(var key in this.viewMap) {
        if(key != cc.PanelID.GAME_WAITING_CONNECTION) {
            this.hideView(key);
        }
        
    }
}

proto.isViewShow = function(viewID) {
    var _this = this;
    if(_this.viewMap[viewID]) {
        return true;
    }
    if(this.loadingViewMap[viewID] == true) {
        //正在加载中...
        return true;
    }

    return false;
}

proto.getCurView = function(viewID) {
    return this.viewMap[viewID];
}

cc.panelMgr = panelMgr;



var exeFlyAction = function(flyInfo) {
    //添加到运行的列表
    var node = flyInfo.node;
    node.active = true;
    node.setPosition(0, 0);

    //移动动作
    var moveBy = cc.moveBy(0.5, cc.p(0, 100));
    //var fadeOut = cc.fadeOut(0.3);
    var finish = cc.callFunc(onFlyMsgFinish, node, flyInfo);
    var seq = cc.sequence(moveBy, finish);

    node.runAction(seq);
}


/**
 * 显示 公用的弹出消息
 */
cc.showPopupMsg = function(msg) {
    cc.panelMgr.showView(cc.PanelID.COMMON_POPUP_PANEL, null, msg);
}

var initFlyMsg= function(node, msg) {
    var des_lbl = cc.UITools.findLabel(node, "des_lbl");
    des_lbl.string = msg;
    node.opacity = 255;
    node.setPosition(0, 0);
}

var getFlyAction = function() {
    //移动动作
    var moveBy = cc.moveBy(0.5, cc.v2(0, 100));
    return moveBy;
}

//渐隐效果
var getFadeAction = function() {
    var fadeAct = cc.fadeOut(0.5);
    var delayAct = cc.delayTime(1);
    var seq = cc.sequence(delayAct, fadeAct);
    return seq;
}


var msgNodes = [];
var msgIndex = 0;
cc.showMultiFlyMsg = function(msg) {
    if (msgIndex > 10) return;
    cc.log("msgIndex", msgIndex);

    var callAct = function(node) {
        if (node.last){
            var txtHeight = cc.UITools.findNode(node, "bg").height;
            cc.log("node call", txtHeight);
            node.y = node.last.y + txtHeight;
        } else {
            node.y += 50;
        }
    }

    var callDelAct = function(node) {
        msgNodes.shift();
        if (msgNodes.length == 0)
            msgIndex = 0;
    }

    cc.resMgr.instancePrefab(cc.PanelID2ResPath[cc.PanelID.COMMON_FLY_PANEL], function(err, node) {
        if (msgIndex > 10) return;
        node.parent = cc.panelMgr.nodeLayer[3];
        msgIndex += 1;
        var seq = cc.sequence(
            cc.callFunc(callAct), 
            cc.delayTime(1), 
            cc.fadeOut(1), 
            cc.callFunc(callDelAct), 
            cc.removeSelf()
            );
        node.last = msgNodes[msgNodes.length - 1];
        node.runAction(seq);
        var txt = cc.UITools.findLabel(node, "des_lbl");
        txt.string = msg;
        msgNodes.push(node);
    });
}


/**
 * @property resMgr
 * @type ResMgr
 */
module.exports = panelMgr;
