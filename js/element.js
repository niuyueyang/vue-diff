/*
* @desc 创建标签
* @params
* {String} type 属性类型
* {Object} props 属性值
* {Array} children 子集
* */
class Element{
    constructor(type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
    }
}

// eslint-disable-next-line no-unused-vars
/*
* @desc 创建标签
* @params
* {String} type 属性类型
* {Object} props 属性值
* {Array} children 子集
* */
function createElement(type, props, children) {
    return new Element(type, props, children)
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

// eslint-disable-next-line no-unused-vars
/*
* @desc 创建标签，并且设置属性
* @params
* {Object} eleobj 虚拟树
* */
function render(eleobj) {
    let el = document.createElement(eleobj.type);
    for(let key in eleobj.props){
        setAttr(el, key, eleobj.props[key])
    }
    eleobj.children.forEach(child => {
        child = (child instanceof Element) ? render(child) : document.createTextNode(child);
        el.appendChild(child);
    })
    return el;
}

// eslint-disable-next-line no-unused-vars
/*
* @desc 将渲染好的标签添加到页面中
* @params
* {Element} el 渲染好的树
* {Element} target 目标位置
* */
function renderDom(el, target) {
    target.appendChild(el)
}