import React from 'react';
import { useParams } from 'react-router-dom';
import useRemoteData from '../network/cache.js';
import { Error } from '../components/index.js';
import createPages from './create-pages.js';
import Controller from './Controller.jsx';

function SlidesOfRemoteData() {
  const { id } = useParams();

  const query = {
    command: 'getFile',
    params: id,
  };

  const { data, error } = useRemoteData(query);
  if (error) return <Error error={error} />;
  if (!data) return null;

  const markdown = data;
  const { pages, theme } = createPages(markdown);
  return <Controller pages={pages} theme={theme} />;
}

export default SlidesOfRemoteData;
