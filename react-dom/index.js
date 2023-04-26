import Componenet from "../react/component";

const ReactDOM = {
  render
}

function render(vnode, container) {
  const ele = _render(vnode);
  return container.appendChild(ele);
}

function createComponent(comp, props) {
  let inst;
  if (comp.prototype && comp.prototype.render) {
    // 类组件
    inst = new comp(props);
  } else {
    // 函数组件转换成类组件
    inst = new Componenet(props);
    inst.constructor = comp;
    inst.render = function() { // 挂载render方法
      return this.constructor(props);
    }
  }

  return inst;
}

export function renderComponent(comp) {
  const renderer = comp.render();
  console.log('renderComponent', renderer);
  const base = _render(renderer);
  if (comp.base && comp.componentWillUpdate) {
    comp.componentWillUpdate();
  }
  if (comp.base && comp.componentDidUpdate) {
    comp.componentDidUpdate();
  } else if (comp.componentDidMount) {
    comp.componentDidMount();
  }

  // 节点替换
  if(comp.base && comp.base.parentNode) {
    comp.base.parentNode.replaceChild(base, comp.base);
  }


  comp.base = base;
  console.log('base', comp.base)
}

function setComponentProps(comp, props) {
  if (!comp.base) {
    if (comp.componentWillMount) comp.componentWillMount();
  } else if (comp.componentWillReceiveProps) {
    comp.componentWillReceiveProps(props);
  }
  // 设置组件属性
  comp.props = props
  // 渲染组件
  renderComponent(comp);
}

function _render(vnode) {
  console.log(vnode);
  if (vnode === undefined 
    || vnode === null
    || vnode === ''
  ) return;

    // 如果vnode是数值
    if (typeof vnode === 'number') {
      vnode = String(vnode);
    }

  // 如果vnode是字符串
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }

  const { tag, attrs, children } = vnode;

  // tag是函数，则渲染组件
  if (typeof tag === 'function') {
    // 创建组件
    const comp = createComponent(tag, attrs);
    console.log('createComponent', comp)
    // 设置组件属性
    setComponentProps(comp, attrs);
    // 组件渲染的节点对象返回
    return comp.base;
  }

  const dom = document.createElement(tag);

  if(attrs) {
    Object.keys(attrs).forEach(key => {
      setAttribute(dom, key, attrs[key]);
    })
  }

  // 渲染子节点
  children && children.forEach(child => render(child, dom));


  return dom;
}

function setAttribute(dom, key, value) {
  if (key === 'className') {
    key = 'class';
  }

  // 如果是事件 onClick onBlur
  if (/on\w+/.test(key)) {
    key = key.toLowerCase();
  }

  if (key === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    }

    if (value && typeof value === 'object') {
      for(let k in value) {
        if (typeof value[k] === 'number') {
          dom.style[k] = value[k] + 'px';
        } else {
          dom.style[k] = value[k];
        }
      }

    } else {
      if (key in dom) {
        dom[key] = value || '';
      }
      if (value) {
        dom.setAttribute(key, value);
      } else {
        dom.removeAttribute(key);
      }
    }
  }

  if (typeof value === 'function') {
    dom[key.toLowerCase()] = value;
  }

  
}

export default ReactDOM;
