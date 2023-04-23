import React from "./react";
import ReactDOM from "./react-dom";

// // undefined
// const ele = undefined;

// // 字符串
// const ele = 'react';


const ele = (
  <div className="active">
    <h3 className="title">hello react</h3>
  </div>
);

console.log(ele);

ReactDOM.render(ele, document.querySelector('#app'))

// const ele = React.createElement("div", null, React.createElement("h3", {
//   className: "title"
// }, "hello react")); 

