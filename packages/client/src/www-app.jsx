import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useRemoteConfig } from './lib/cache';
import { Error, Loading, NotFound } from './components';
import { ROOT_PATH, SLIDES_PATH_WITH_ID } from './lib/route';
import FileList from './pages/FileList';
import Slides from './slides/Slides';

function App() {
  const { data } = useRemoteConfig();

  if (!data) return <Loading />;

  return (
    <Router>
      <Routes>
        <Route path={ROOT_PATH} element={<FileList />} />
        <Route path={SLIDES_PATH_WITH_ID} element={<Slides />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
