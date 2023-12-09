import React, { Suspense, lazy } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { Button } from 'antd';
// import Home from "./pages/Home";
// import About from "./pages/About";

// 魔法命名: 这里通过webpackChunkName确保打包后的文件是一个独立的叫home的文件
const Home = lazy(() => import(/* webpackChunkName: 'home' */ './pages/Home'));
const About = lazy(() => import(/* webpackChunkName: 'about' */ './pages/About'));

function App() {
  return (
    <div>
      <h1>App</h1>
      <Button type="primary">按钮</Button>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
      {/* 懒加载组件必须包裹在suspense中 */}
      <Suspense fallback={<div>loading...</div>}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
