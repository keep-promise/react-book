import Componenet from "./component";
const React = {
  createElement,
  Componenet,
}

function createElement(tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children,
    key: attrs.key || null
  }
}

export {
  Componenet
}

export default React;
