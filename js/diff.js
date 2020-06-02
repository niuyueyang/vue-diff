/*
* @desc diff算法
* @params
* {Object} oldTree 旧树
* {Object} newTree 新树
* @return
* {Object} 补丁包
* @example
* {1: [], 2: []}
* */
function diff(oldTree, newTree) {
    let patches = {};
    let index = 0;
    // 对比
    walk(oldTree, newTree, index, patches)
    return patches;
}

/*
* @desc 对比属性
* @params
* {Object} oldAttrs 旧属性
* {Object} newAttrs 新属性
* @return
* {Object} 返回带有差异的属性
* */
function diffAttr(oldAttrs, newAttrs) {
    let obj = {};
    for(let key in oldAttrs){
        let newAttr = newAttrs[key];
        let oldAttr = oldAttrs[key];
        if(newAttr !== oldAttr){
            obj[key] = newAttr; // 如果新属性上某一个属性被删除，则为undefined
        }
    }
    // 以下为旧属性没有，新属性有值
    for(let key in newAttrs){
        let newAttr = newAttrs[key];
        if(!oldAttrs.hasOwnProperty(key)){
            obj[key] = newAttr;
        }
    }
    return obj;
}

/*
* @desc 对比新旧树子节点
* @params
* {Array} oldChildren 旧子节点
* {Array} newChildren 新子节点
* {Object} patches 两棵树子元素的差异
* */
let Index = 0;
function diffChildren(oldChildren, newChildren, patches) {
    oldChildren.forEach((child, idx) => {
        walk(child, newChildren[idx], ++Index, patches)
    })
}

/*
* @desc 判断是否为为文本节点
* @params
* {Element} node 要判断的元素
* */
function isString(node) {
    return Object.prototype.toString.call(node) === '[object String]'
}

/*
* @desc 将两棵树差异返出来
* @params
* {Object} oldTree 旧树
* {Object} newTree 新树
* {Number} index 当前children的下标
* {Object} patches 两棵树的差异
* */
function walk(oldTree, newTree, index, patches) {
    let currentPath = [];
    // 节点被删除
    if(!newTree){
        currentPath.push({type: 'REMOVE', index})
    }
    // 判断是否是文本节点
    else if(isString (oldTree) && isString(newTree)){
        if(oldTree !== newTree){
            currentPath.push({type: 'TEXT', text: newTree})
        }
    }
    // 节点标签完全一样
    else if(oldTree.type === newTree.type){
        // 比较属性是否有更改
        let attrs = diffAttr(oldTree.props, newTree.props);
        if(Object.keys(attrs).length > 0){
            currentPath.push({type: 'ATTRS', attrs})
        }
        // 如果有子节点，遍历子节点
        diffChildren(oldTree.children, newTree.children, patches)
    }
    // 节点被替换
    else{
        currentPath.push({type: 'REPLACE', newTree})
    }
    // 当前元素有差异
    if(currentPath.length > 0){
        patches[index] = currentPath
    }
}