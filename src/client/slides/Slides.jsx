import React from 'react';
import SlidesOfLocalData from './SlidesOfLocalData.jsx';
import SlidesOfRemoteData from './SlidesOfRemoteData.jsx';

function Slides() {
  if (window.location.protocol === 'file:') return <SlidesOfLocalData />;

  return <SlidesOfRemoteData />;
}

export default Slides;
