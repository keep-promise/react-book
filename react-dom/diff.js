import { createComponent, setAttribute, setComponentProps } from ".";

export function diff(dom, vnode, container) {
  // 对比节点的变化
  const ret = diffNode(dom, vnode);
  if (container) {
    container.appendChild(ret);
  }
  return ret;
}

function diffNode(dom, vnode) {
  let ret = dom;
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
    if(dom && dom.nodeType === 3) {
      if (dom.textContext !== vnode) {
        // 更新文本内容
        dom.textContext = vnode;
      }
    } else {
      ret = document.createTextNode(vnode);
      if (dom && dom.parentNode) {
        dom.parentNode.replaceNode(ret, dom);
      }
    }
    return ret;
  }
  // 非文本DOM节点
  if(!dom) {
    ret = document.createElement(vnode.tag);
  }
  // 比较子节点（dom节点和组件）
  if (vnode.children && vnode.children.length > 0 || (ret.childNodes && ret.childNodes.length > 0)) {
    // 对比组件 或者子节点
    diffChildren(ret, vnode.children);
  }
  diffAttribute(ret, vnode);
  return ret;
}

function diffComponent(dom, vnode) {
  let comp = dom;
  // 如果组件没有变化，重新设置props
  if (comp && comp.constructor === vnode.tag) {
    // 重新设置props
    setComponentProps(comp, vnode.attrs);
    // 赋值
    dom = comp.base;
  } else {
    // 组件类型发生变化
    if(comp) {
      // 先移除就组件
      unmountComponent(comp);
      comp = null;
    }

    // 1.创建新z组件
    comp = createComponent(vnode.tag, vnode.attrs);

    // 2.设置组件属性
    setComponentProps(comp, vnode.attrs)
    // 3.给当前挂载base
    dom = comp.base;
  }
  return dom;
}

function unmountComponent(com) {
  removeNode(comp.base);
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeNode(dom)
  }
}

function diffChildren(dom, vchildren) {
  const domChildren = dom.childNodes;
  const children = [];
  const keyed = {};

  // 将有key的节点（用对象保存）和没有key的节点（用数组保存）分开

  if(vchildren && vchildren.length > 0) {
    let min = 0;
    let childrenLen = children.length;
    [...vchildren].forEach((vchild, i) => {
      // 获取虚拟DOM中所有的key
      const key = vchild.key;
      let child;
      if (key) {
        // 如果有key，找到对应key值得节点
        if (keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined;
        }
      } else if (childrenLen > min) {
        // 如果没有key，则优先找到类型相同的节点
        for (let j = min; j < childrenLen; j ++) {
          let c = children[j];
          if(c) {
            child = c;
            children[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      }
      // 对比
      child = diffNode(child, vchild);
      // 更新DOM
      const f = domChildren[i];

      if(child && child !== dom && child !== f) {
        // 如果更新前的对应位置为空，说明此节点是新增的
        if(!f) {
          dom.appendChild(child);

          // 如果更新后的节点和更新前对应位置的下一个节点一样
        } else if (child === f.nextSibling) {
          reomoveNode(f);

          // 将更新后的节点移动到正确的位置
        } else {
          dom.insertBefore(child, f);
        }
      }
    })
  }
}

function diffAttribute(dom, vnode) {
  // 保存之前的DOM的所有属性
  const oldAttrs = {};
  const newAttrs = vnode.attrs;
  // dom 是原有的节点对象 vnode 虚拟DOM
  const domAttrs = dom.attributes;
  console.log('domAttrs', domAttrs);
  [...domAttrs].forEach(item => {
    oldAttrs[item.name] = item.value;
  });

  // 比较
  // 如果原来属性跟新的属性对比，不在新的属性只，则将其移除掉
  for(let key in oldAttrs) {
    if(!(key in newAttrs)) {
      setAttribute(dom, key, undefined);
    }
  }

  for(let key in newAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      // 值不同，更新值
      setAttribute(dom, key, newAttrs[key]);
    }
  }
}


