import Componenet from "./component";
const React = {
  createElement,
  Componenet,
}

function createElement(tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children
  }
}

export {
  Componenet
}

export default React;
