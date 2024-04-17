import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { getMatches, type } from './platform';
import defaultEnv from './default-env';
import EnvContext from './env-context';
import makeid from './utils/makeid';
import { SLIDES_PATH } from './routes';
import Home from './pages/Home';
import { NotFound } from './common';

function App() {
  const Slides = React.lazy(() => import('./slides/Slides'));
  const [isInited, setIsInited] = useState(false);
  const env = useMemo(() => ({ ...defaultEnv }), []);

  useEffect(() => {
    let isUnMounted = false;
    const getEnv = async () => {
      if (isUnMounted || isInited) return;

      env.backendOsType = await type();
      const matches = await getMatches();
      if (isUnMounted || isInited) return;
      const { value } = matches.args.dir;
      if (typeof value !== 'string') {
        throw new TypeError('matches.args.dir.value must be a string');
      }
      env.rootDir = value;
      setIsInited(true);
    };
    void getEnv();

    return () => {
      isUnMounted = true;
    };
  }, [Slides, env, isInited]);

  if (!isInited) return null;

  const routes = [
    {
      path: SLIDES_PATH,
      element: (
        <React.Suspense>
          <Slides />
        </React.Suspense>
      ),
    },
  ];

  const helmetContext = {};
  return (
    <HelmetProvider context={helmetContext}>
      <EnvContext.Provider value={env}>
        <Router>
          <Routes>
            <Route index element={<Home />} />
            {routes.map((route) => (
              <Route key={makeid()} path={route.path} element={route.element} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </EnvContext.Provider>
    </HelmetProvider>
  );
}

export default App;
