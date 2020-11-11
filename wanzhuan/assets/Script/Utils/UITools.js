/**
 * UI界面的一些辅助方法
 */

var UIToos = {
     /**
      * 
     * !#en Returns a compoent fo child node name childName
     * !#zh 获得parentNode 下childName节点的 组件 如果childName为空则重parentNode上获取
     * @method findComponent
     * @param {Node} parentNode
     * @param {String} childName
     * @param {Function|String} typeOrClassName
     * @return {Component[]}
     * @example
     * var sprites = cc.UITools.findComponent(parentNode, "test", cc.Sprite);
     */
    findComponent: function(parentNode, childName, typeOrClassName) {
        if(childName == null) {
            return parentNode.getComponent(typeOrClassName);
        }else {
            var childNode = UIToos.findNode(parentNode, childName);
            if(childNode != null) {
                return childNode.getComponent(typeOrClassName);
            }else {
                cc.error("UIToos findComponent childNode is nil childName = ", childName);
            }
        }
        
    },

    findNode: function(parentNode, childName) {
        if(childName == null) {
            return parentNode;
        }else {
            for (var i = 0; i < parentNode.children.length; i++) {
                var node = parentNode.children[i];
                if(node._name == childName) {
                    return node;
                }

                //在子节点上寻找
                var node = UIToos.findNode(node, childName);
                if(node != null) {
                    return node;
                }
            }
            //return parentNode.getChildByName(childName);
        }
    },

    /**
     * 查找一个Sprite组件
     */
    findSprite: function(parentNode, childName) {
        return UIToos.findComponent(parentNode, childName, cc.Sprite);
    },

    findButton: function(parentNode, childName) {
        return UIToos.findComponent(parentNode, childName, cc.Button);
    },

    findLabel: function(parentNode, childName) {
        return UIToos.findComponent(parentNode, childName, cc.Label);
    },

    findRichText: function(parentNode, childName) {
        return UIToos.findComponent(parentNode, childName, cc.RichText);
    },

    findLayout: function(parentNode, childName) {
        return UIToos.findComponent(parentNode, childName, cc.Layout);
    },

    setRichText: function(para) {
        if (!para.node) return;
        var str = "";
        for (var i = 0; i < para.contents.length; i++)
        {
            str += "<color=" + para.contents[i].color + ">" + para.contents[i].str + "</c>";
        }
        para.node.string = str;
    },

    /**
     * 为按钮添加点击事件
     */
    addClick: function(node, cb, param) {
        node.on('click', function(event) {
            cb(event, param);
        });
    },



   /*
    1.白色
    2.绿色
    3.蓝色
    4.紫色
    5.金色
    6.红色
   */
   setQualityColor: function(cmp, quality) {
        var color = cc.color(255, 255, 255);
        if(quality == 1) {
            color = cc.color(255, 255, 255);
        }else if(quality == 2) {
            color = cc.color(0, 255, 0);
        }else if(quality == 3) {
            color = cc.color(0, 0, 255);
        }else if(quality == 4) {
            color = cc.color(255, 0, 255);
        }else if(quality == 5) {
            color = cc.color(255, 255, 0);
        }else if(quality == 6) {
            color = cc.color(255, 0, 0);
        }

        cmp.node.color = color;
   },

  


  
   
}
cc.UIToos = UIToos;
cc.UITools = UIToos;
module.exports = UIToos;
