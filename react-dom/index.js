const ReactDOM = {
  render
}

function render(vnode, container) {
  console.log(vnode);
  if (vnode === undefined) return;

  // 如果vnode是字符串
  if (typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode);
    return container.appendChild(textNode);
  }

  const { tag, attrs, children } = vnode;
  const dom = document.createElement(tag);

  if(attrs) {
    Object.keys(attrs).forEach(key => {
      setAttribute(dom, key, attrs[key]);
    })
  }

  // 渲染子节点
  children.forEach(child => render(child, dom));


  return container.appendChild(dom);
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

  
}

export default ReactDOM;
