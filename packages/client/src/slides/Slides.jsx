import React from 'react';
import SlidesOfLocalData from './SlidesOfLocalData';
import SlidesOfRemoteData from './SlidesOfRemoteData';

function Slides() {
  if (window.location.protocol === 'file:') return <SlidesOfLocalData />;

  return <SlidesOfRemoteData />;
}

export default Slides;
