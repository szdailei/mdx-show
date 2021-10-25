import React from 'react';
import { useParams } from 'react-router-dom';
import { useRemoteData } from '../lib/cache';
import { Error } from '../components';
import createPages from './create-pages';
import Controller from './Controller';

function SlidesOfRemoteData() {
  const { id } = useParams();
  const query = `{getFile(file:"${id}")}`;

  const { data, error } = useRemoteData(query);
  if (error) return <Error error={error} />;
  if (!data) return null;

  const markdown = data.getFile;
  const pages = createPages(markdown);
  return <Controller pages={pages} />;
}

export default SlidesOfRemoteData;
