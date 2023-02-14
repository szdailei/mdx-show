/* eslint-disable no-param-reassign */
import { HTMLProps } from 'react';
import defaultEnv from '../../../server/default-env';

function isUrl(abbrUrl: string) {
  try {
    void new URL(abbrUrl);
  } catch (err) {
    return false;
  }
  return true;
}

function toFullUrlOfImage(abbrUrl: string) {
  if (isUrl(abbrUrl)) return abbrUrl;
  const fullUrl = `${defaultEnv.mediaUrl}${defaultEnv.imagesDir}${abbrUrl}`;
  return fullUrl;
}

function toFullUrlOfVideo(abbrUrl: string) {
  if (isUrl(abbrUrl)) return abbrUrl;
  const fullUrl = `${defaultEnv.mediaUrl}${defaultEnv.videosDir}${abbrUrl}`;
  return fullUrl;
}

function modifyPropsOfMedia(props: HTMLProps<unknown>, tagName: string) {
  switch (tagName) {
    case 'img':
      props.src = toFullUrlOfImage(props.src);
      break;
    case 'source':
    case 'track':
      props.src = toFullUrlOfVideo(props.src);
      break;
    case 'video':
      props.controls = true;
      props.crossOrigin = 'anonymous';
      props.preload = 'auto';
      if (props.poster !== undefined) {
        props.poster = toFullUrlOfImage(props.poster);
      }
      break;
    default:
      break;
  }
}

export default modifyPropsOfMedia;
