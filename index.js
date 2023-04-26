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
); // babel-plugin-transform-react-jsx，jsx插件转换成

// const ele = React.createElement("div", null, React.createElement("h3", {
//   className: "title"
// }, "hello react")); 

console.log('vnode',ele);

// 函数组件
// function Home() {
//   return (
//     <div className="active">
//       <h3 className="title">hello react</h3>
//     </div>
//   );
// }

// 类组件
class Home extends React.Componenet {
  constructor(props) {
    super(props);
    this.state = {
      num: 0
    }
  }

  // 生命周期


  componentWillMount() {
    console.log('组件将要加载');
  }

  componentWillReceiveProps(props) {
    console.log('props');
  }

  componentWillUpdate() {
    console.log('组件将要更新');
  }

  componentDidUpdate() {
    console.log('组件更新完成');
  }

  componentDidMount() {
    console.log('组件加载完成');
  }
 
  handleClick(){
    console.log('handleClick')
    // 修改状态 setState
    this.setState({
      num: this.state.num + 1
    })
  }

  render() {
    return (
      <div className="active">
        <h3 className="title">hello react</h3>
        <h3 className="title">{this.state.num}</h3>
        <button onClick={this.handleClick.bind(this)}>add</button>
      </div>
    );
  }
}

console.log('Home', <Home name="home" />)


// ReactDOM.render(ele, document.querySelector('#app'))
ReactDOM.render(<Home name="home" />, document.querySelector('#app'))

// const ele = React.createElement("div", null, React.createElement("h3", {
//   className: "title"
// }, "hello react")); 

