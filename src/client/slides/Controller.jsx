import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Article from './Article.jsx';

function requestFullscreen() {
  if (document.fullscreenEnabled && !document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  }
}

function toggleFullScreen() {
  if (!document.fullscreenEnabled) return;

  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function isEditing() {
  const { activeElement } = document;
  if (!activeElement) return false;

  switch (activeElement.tagName) {
    case 'INPUT':
    case 'TEXTAREA':
      return true;
    default:
      return false;
  }
}

function isVideoActived() {
  const { activeElement } = document;

  if (activeElement.tagName !== 'VIDEO') return false;

  return true;
}

function Controller({ pages, theme }) {
  requestFullscreen();

  const articleRef = useRef();

  const getCurrentPageCount = useCallback(() => articleRef.current.getCurrentPageCount(), []);
  const setCurrentPageCount = useCallback((newCount) => {
    articleRef.current.setCurrentPageCount(newCount);
  }, []);

  const onKeyUp = useCallback(
    (event) => {
      if (isEditing()) return;

      switch (event.code) {
        case 'KeyF':
          event.preventDefault();
          toggleFullScreen();
          break;
        case 'Enter':
        case 'PageUp':
        case 'Numpad9':
          event.preventDefault();
          if (getCurrentPageCount() > 0) {
            setCurrentPageCount(getCurrentPageCount() - 1);
          }
          break;
        case 'Space':
          if (isVideoActived()) {
            break;
          }
        // eslint-disable-next-line no-fallthrough
        case 'PageDown':
        case 'Numpad3':
          event.preventDefault();
          if (getCurrentPageCount() < pages.length - 1) {
            setCurrentPageCount(getCurrentPageCount() + 1);
          }
          break;
        case 'Home':
        case 'Numpad7':
          event.preventDefault();
          setCurrentPageCount(0);
          break;
        case 'End':
        case 'Numpad1':
          event.preventDefault();
          setCurrentPageCount(pages.length - 1);
          break;
        default:
          break;
      }
    },
    [pages, getCurrentPageCount, setCurrentPageCount]
  );

  // The MouseEvent.button read-only property indicates which button was pressed on the mouse to trigger the event.
  // 0: Main button pressed, usually the left button or the un-initialized state
  // 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
  // 2: Secondary button pressed, usually the right button
  // 3: Fourth button, typically the Browser Back button
  // 4: Fifth button, typically the Browser Forward button
  const onPointerUp = useCallback(
    (event) => {
      switch (event.button) {
        case 3:
          event.preventDefault();
          if (getCurrentPageCount() > 0) {
            setCurrentPageCount(getCurrentPageCount() - 1);
          }
          break;
        case 4:
          event.preventDefault();
          if (getCurrentPageCount() < pages.length - 1) {
            setCurrentPageCount(getCurrentPageCount() + 1);
          }
          break;
        default:
          break;
      }
    },
    [pages, getCurrentPageCount, setCurrentPageCount]
  );

  useEffect(() => {
    setCurrentPageCount(0);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [onKeyUp, setCurrentPageCount]);

  return <Article pages={pages} style={theme} onPointerUp={onPointerUp} ref={articleRef} />;
}

Controller.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.element).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  theme: PropTypes.object.isRequired,
};

export default Controller;
