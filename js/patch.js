/*
* @desc 将两棵树差异性放到页面中
* @params
* {Element} el 将旧virtualDom转化为element
* {Object} patches 新旧两棵树差异
* @example
* patches:   {0: [attrs: {class: "list1"},type: "ATTRS"], 2: Array(1), 6: [text: "3",type: "TEXT"]}
* */

let allPatches;
let index = 0; // 默认哪个属性需要打补丁
function patchRender(el, patches) {
    console.log(patches)
    allPatches = patches;
    walkRender(el)
}

/*
* @desc 渲染子节点
* @params
* {Element} node 旧有的dom
* */

function walkRender(node) {
    // 将patches里面的0,1,2...当做key值，取出对应数组
    let currentPath = allPatches[index++];
    let childNodes = node.childNodes;
    childNodes.forEach(child => {
        walkRender(child)
    })
    if(currentPath){
        doPath(node, currentPath)
    }
}

/*
* @desc 设置属性
* @params
* {Element} node 当前标签
* {String} key 属性
* {String, ...} value 属性值
* */
function setAttr(node, key, value) {
    switch(key){
        case 'value':
            if(node.tagName.toLowerCase() === 'input' || node.tagName.toLowerCase() === 'textarea'){
                node.value = value
            }
            else{
                node.setAttribute(key, value)
            }
            break;
        case 'style':
            node.style.cssText = value;
            break;
        default:
            node.setAttribute(key, value);
            break;
    }

}

/*
* @desc 将不定渲染到页面中
* @params
* {Element} node 旧有的dom
* {Array} patches 每一级对应不定数组
* */
function doPath(node, patches) {
    console.log(patches)
    patches.forEach(patch => {
        switch (patch.type){
            case 'ATTRS':
                for(let key in patch.attrs){
                    let value = patch.attrs[key];
                    if(value){
                        setAttr(node, key, value)
                    }
                    else{
                        node.removeAttribute(key)
                    }
                }
                break;
            case 'TEXT':
                node.textContent = patch.text;
                break;
            case 'REPLACE':
                let newNode = (patch.newTree instanceof Element) ? render(patch.newTree) : document.createTextNode(patch.newTree);
                node.parentNode.replaceChild(newNode, node)
                break;
            case 'REMOVE':
                node.parentNode.removeChild(node);
                break;
            default:
                break;
        }
    })
}