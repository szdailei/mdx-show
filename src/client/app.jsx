import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { makeid } from './utils/index.js';
import { ROOT_PATH, SLIDES_PATH_WITH_ID } from './route/route.js';
import init from './init.js';
import { NotFound } from './page-components/index.js';
import Home from './pages/Home.jsx';
import Slides from './slides/Slides.jsx';
import debugStartPoint from './slides/create-pages.js'

function App() {
  const routes = [
    { path: ROOT_PATH, element: <Home /> },
    { path: SLIDES_PATH_WITH_ID, element: <Slides /> },
    { path: '*', element: <NotFound /> },
  ];

  return (
    <Router>
      <Routes>
        {routes.map((route) => (
          <Route key={makeid()} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

function Init() {
  const [inited, setInited] = useState(false);

  useEffect(() => {
    if (init.isFinished()) return;

    const aboveUrlOfFilterStack = import.meta.url;
    const aboveFuncNameOfFilterStack = debugStartPoint.name;

    init({ aboveUrlOfFilterStack, aboveFuncNameOfFilterStack });
    while (!init.isFinished()) {
      // eslint-disable-next-line no-empty
    }

    setInited(true);
  }, []);

  return inited ? <App /> : null;
}

ReactDOM.render(<Init />, document.getElementById('root'));
